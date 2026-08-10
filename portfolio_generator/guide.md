# LinkedIn PDF → Resume & Portfolio Generator — Full Guide

> One quick flag before we start: earlier you'd decided to build the backend in **Python**. This guide uses **Java (Spring Boot)** since that's what you just asked for. Java is a fine, production-grade choice — just know it means more boilerplate than Python/FastAPI would've, and slightly slower to prototype. If you want to switch back, say so and I'll redo this.

---

## 1. Project Plan (MVP Scope)

**Flow:** `Landing → Upload PDF → Review/Edit extracted data → Generate Resume + Portfolio`

**In scope for v1:**
- Upload LinkedIn "Save to PDF" export
- Parse into structured data (name, headline, summary, experience, education, skills)
- Let user review/correct extracted data before generating anything
- Generate a downloadable resume (PDF) and a hosted portfolio page
- No auth required to generate; auth only required to get a *persistent, editable* portfolio URL

**Explicitly out of scope for v1** (add later): certifications, recommendations, multiple templates, team/collaboration features, analytics.

---

## 2. Architecture

```
┌─────────────┐     upload PDF      ┌──────────────────────┐
│   React     │ ──────────────────▶ │   Spring Boot API     │
│  Frontend   │                     │   (Java 21)            │
│             │ ◀────────────────── │                        │
└─────────────┘   structured JSON   └──────────┬─────────────┘
                                                │
                        ┌───────────────────────┼───────────────────────┐
                        ▼                       ▼                       ▼
                ┌───────────────┐      ┌────────────────┐      ┌────────────────┐
                │ PDF Parser     │      │ PostgreSQL      │      │ File Storage    │
                │ (Apache PDFBox)│      │ (structured data)│     │ (Cloudflare R2) │
                └───────────────┘      └────────────────┘      └────────────────┘
                                                │
                                                ▼
                                        ┌────────────────┐
                                        │ Resume/Portfolio│
                                        │ Renderer        │
                                        │ (HTML→PDF via   │
                                        │  OpenHTMLtoPDF) │
                                        └────────────────┘
```

**Why these pieces:**
- **Apache PDFBox** — mature Java library for reading PDF text/layout. Free, no external API.
- **PostgreSQL** — relational fit for structured resume data (experience, education as related tables).
- **OpenHTMLtoPDF** — lets you design one HTML/CSS template and reuse it for both the on-screen portfolio and the downloadable resume PDF. Avoids maintaining two separate rendering paths.
- **Cloudflare R2** — S3-compatible object storage with a generous free tier and no egress fees (unlike AWS S3), good fit for storing uploaded PDFs/photos at zero cost while small.

---

## 3. Free-Cost Hosting Plan

| Layer | Service | Free tier notes |
|---|---|---|
| Frontend | Vercel or Netlify | Free for personal projects, auto-deploy from GitHub |
| Backend (Spring Boot) | Render (free web service) or Railway (free trial credits) | Free tier sleeps after inactivity — fine for MVP/demo |
| Database | Neon or Supabase (Postgres) | Free tier, a few GB storage |
| File storage | Cloudflare R2 | 10GB free storage, no egress fees |
| Domain | Optional — use the platform's subdomain initially | Buy a domain later once validated |

**Correction on expectations:** "free" hosting tiers sleep/cold-start and have resource caps. Fine for building and demoing to real users; you'll outgrow it once you have real traffic, and that's a good problem to have.

---

## 4. Backend Structure (Spring Boot)

```
backend/
├── pom.xml
├── src/main/java/com/portfoliogen/
│   ├── PortfolioGenApplication.java
│   ├── controller/
│   │   ├── UploadController.java
│   │   ├── ProfileController.java
│   │   └── GenerateController.java
│   ├── service/
│   │   ├── PdfParserService.java
│   │   ├── PdfGeneratorService.java
│   │   └── StorageService.java
│   ├── model/
│   │   ├── Profile.java
│   │   ├── Experience.java
│   │   ├── Education.java
│   │   └── Skill.java
│   ├── repository/
│   │   ├── ProfileRepository.java
│   │   ├── ExperienceRepository.java
│   │   └── EducationRepository.java
│   └── dto/
│       └── ProfileDTO.java
└── src/main/resources/
    ├── application.yml
    └── templates/
        └── portfolio-template.html
```

### Key model — `Profile.java`
```java
@Entity
public class Profile {
    @Id @GeneratedValue
    private UUID id;

    private String name;
    private String headline;
    private String location;
    @Column(length = 2000)
    private String summary;
    private String photoUrl;
    private String slug; // used for portfolio URL: yoursite.com/p/{slug}

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL)
    private List<Experience> experiences = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL)
    private List<Education> education = new ArrayList<>();

    @ElementCollection
    private List<String> skills = new ArrayList<>();

    // getters/setters
}
```

### PDF parsing — `PdfParserService.java` (core logic)
```java
@Service
public class PdfParserService {

    public ProfileDTO parse(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String rawText = stripper.getText(document);

            ProfileDTO dto = new ProfileDTO();
            dto.setRawText(rawText); // keep raw text for debugging bad parses

            dto.setName(extractName(rawText));
            dto.setHeadline(extractHeadline(rawText));
            dto.setSummary(extractSection(rawText, "Summary", "Experience"));
            dto.setExperiences(extractExperienceSection(rawText));
            dto.setEducation(extractEducationSection(rawText));
            dto.setSkills(extractSkillsSection(rawText));

            return dto;
        }
    }

    private String extractSection(String text, String startMarker, String endMarker) {
        int start = text.indexOf(startMarker);
        int end = text.indexOf(endMarker, start);
        if (start == -1) return "";
        if (end == -1) end = text.length();
        return text.substring(start + startMarker.length(), end).trim();
    }

    // extractName, extractHeadline, extractExperienceSection,
    // extractEducationSection, extractSkillsSection follow the same
    // "find section header, slice until next known header" pattern.
    // Build and test these against 5-10 real sample PDFs first —
    // LinkedIn's export layout is consistent but not identical across
    // profile types (some have photos, some don't, section order can shift).
}
```

**Honest note on this parser:** this line-based/marker approach is a reasonable v1, but it's brittle — it breaks if LinkedIn tweaks their export format, or if a section is missing/reordered. For v1 this is fine. If you outgrow it, the next step up is using PDFBox's `PDFTextStripperByArea` to work off actual coordinate positions rather than text search, which is more robust but more work upfront. Don't start there — start simple, upgrade when the simple version actually breaks on real user PDFs.

### Upload endpoint — `UploadController.java`
```java
@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private final PdfParserService parserService;

    public UploadController(PdfParserService parserService) {
        this.parserService = parserService;
    }

    @PostMapping
    public ResponseEntity<ProfileDTO> upload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty() || !"application/pdf".equals(file.getContentType())) {
            return ResponseEntity.badRequest().build();
        }
        try {
            ProfileDTO parsed = parserService.parse(file);
            return ResponseEntity.ok(parsed);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
```

---

## 5. Frontend Structure (React)

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Upload.jsx
│   │   ├── ReviewEdit.jsx
│   │   └── PortfolioView.jsx
│   ├── components/
│   │   ├── DragDropUpload.jsx
│   │   ├── ExperienceForm.jsx
│   │   ├── EducationForm.jsx
│   │   └── ResumePreview.jsx
│   └── api/
│       └── client.js
```

### Drag-and-drop upload — `DragDropUpload.jsx`
```jsx
import { useState, useCallback } from "react";

export default function DragDropUpload({ onFileAccepted }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      onFileAccepted(file);
    } else {
      alert("Please upload a PDF file (LinkedIn's 'Save to PDF' export).");
    }
  }, [onFileAccepted]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${isDragging ? "#4f46e5" : "#ccc"}`,
        borderRadius: "12px",
        padding: "48px",
        textAlign: "center",
        cursor: "pointer",
        transition: "border-color 0.2s"
      }}
      onClick={() => document.getElementById("fileInput").click()}
    >
      <input
        id="fileInput"
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={(e) => e.target.files[0] && onFileAccepted(e.target.files[0])}
      />
      <p>Drag & drop your LinkedIn PDF here, or click to browse</p>
      <p style={{ fontSize: "0.85em", color: "#888" }}>
        Don't have it yet? Go to your LinkedIn profile → "More" → "Save to PDF"
      </p>
    </div>
  );
}
```

---

## 6. Database Schema (Postgres, via JPA/Hibernate auto-DDL or Flyway)

```sql
CREATE TABLE profile (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    headline VARCHAR(255),
    location VARCHAR(255),
    summary TEXT,
    photo_url VARCHAR(500),
    slug VARCHAR(100) UNIQUE
);

CREATE TABLE experience (
    id UUID PRIMARY KEY,
    profile_id UUID REFERENCES profile(id) ON DELETE CASCADE,
    title VARCHAR(255),
    company VARCHAR(255),
    start_date VARCHAR(50),
    end_date VARCHAR(50),
    location VARCHAR(255),
    description TEXT
);

CREATE TABLE education (
    id UUID PRIMARY KEY,
    profile_id UUID REFERENCES profile(id) ON DELETE CASCADE,
    school VARCHAR(255),
    degree VARCHAR(255),
    field_of_study VARCHAR(255),
    start_date VARCHAR(50),
    end_date VARCHAR(50)
);

CREATE TABLE profile_skills (
    profile_id UUID REFERENCES profile(id) ON DELETE CASCADE,
    skill VARCHAR(100)
);
```

---

## 7. Build Order (do it in this sequence)

1. Spring Boot project skeleton + Postgres connection (get "hello world" API running)
2. `PdfParserService` — test against 5-10 real LinkedIn PDF exports, log raw text to see what you're working with
3. Upload endpoint returning parsed JSON (no DB save yet — just verify parsing works)
4. React upload page + review/edit form showing parsed data
5. Save endpoint (persist reviewed data to DB)
6. Portfolio template (HTML/CSS) + public view page by slug
7. Resume PDF generation (reuse the same HTML template via OpenHTMLtoPDF)
8. Deploy each piece (DB → backend → frontend) and test the full flow end-to-end
9. Only then: add auth, polish design, add optional sections

**Correction on how people usually fail this:** don't build all backend pieces before touching the frontend, and don't polish the UI before the parser works on real data. Get one ugly end-to-end path working first (steps 1-3 above, then a bare-bones version of 4-7), then improve each piece.

---

## 8. Sample Prompt (if using Claude/AI to help you code each piece)

```
I'm building a Spring Boot service that parses LinkedIn "Save to PDF"
exports into structured JSON (name, headline, summary, experience[],
education[], skills[]). I'm using Apache PDFBox for text extraction.

Here is a raw text dump from one sample PDF: [paste rawText output]

Help me write regex/logic to reliably extract the Experience section
into a list of {title, company, startDate, endDate, description}
objects, handling the case where dates are formatted as "Jan 2020 -
Present" or "2019 - 2021".
```

Feeding it real sample output (not a hypothetical) will get you far more useful code than a generic prompt.
