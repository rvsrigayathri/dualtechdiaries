import * as pdfjsLib from 'pdfjs-dist';

// Set standard PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extracts raw text from a PDF file using PDF.js
 */
export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  
  let fullText = '';
  const pageTexts = [];

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const pageLines = [];
    let currentY = null;
    let currentLine = '';

    for (const item of textContent.items) {
      if ('str' in item && item.str.trim()) {
        const y = Math.round(item.transform[5]);
        if (currentY !== null && Math.abs(currentY - y) > 4) {
          if (currentLine.trim()) pageLines.push(currentLine.trim());
          currentLine = item.str;
        } else {
          currentLine += (currentLine ? ' ' : '') + item.str;
        }
        currentY = y;
      }
    }
    if (currentLine.trim()) pageLines.push(currentLine.trim());

    const pageText = pageLines.join('\n');
    pageTexts.push(pageText);
    fullText += pageText + '\n';
  }

  return { fullText, pageTexts };
}

/**
 * Parses raw LinkedIn PDF text into a structured profile object
 */
export function parseLinkedInText(rawText) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  const profile = {
    name: '',
    headline: '',
    location: '',
    email: '',
    phone: '',
    website: '',
    github: '',
    linkedin: '',
    summary: '',
    photoUrl: '',
    skills: [],
    experiences: [],
    education: [],
    projects: []
  };

  if (lines.length === 0) return profile;

  // 1. Extract Basic Info (LinkedIn PDF structure usually places Name & Headline near top)
  profile.name = lines[0] || 'Your Name';
  profile.headline = lines[1] || '';
  if (lines[2] && !lines[2].includes('Summary') && !lines[2].includes('Experience')) {
    profile.location = lines[2];
  }

  // Find Contact details if present (email, linkedin, phone)
  lines.forEach(line => {
    if (line.includes('@') && !profile.email) {
      const match = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (match) profile.email = match[0];
    }
    if (line.includes('linkedin.com/in/') && !profile.linkedin) {
      profile.linkedin = line;
    }
    if (line.match(/\+?\d[\d\s\-()]{8,}\d/) && !profile.phone) {
      profile.phone = line;
    }
  });

  // 2. Extract Sections based on Common Headers
  let currentSection = null;
  let sectionBuffers = {
    summary: [],
    experience: [],
    education: [],
    skills: []
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    if (lower === 'summary' || lower === 'about') {
      currentSection = 'summary';
      continue;
    } else if (lower === 'experience' || lower === 'work experience') {
      currentSection = 'experience';
      continue;
    } else if (lower === 'education') {
      currentSection = 'education';
      continue;
    } else if (lower === 'skills' || lower === 'top skills' || lower === 'skills & expertise') {
      currentSection = 'skills';
      continue;
    } else if (lower === 'contact' || lower === 'languages' || lower === 'certifications') {
      currentSection = null; // stop accumulating into previous section
      continue;
    }

    if (currentSection) {
      sectionBuffers[currentSection].push(line);
    }
  }

  // Parse Summary
  profile.summary = sectionBuffers.summary.join(' ');

  // Parse Skills
  if (sectionBuffers.skills.length > 0) {
    profile.skills = sectionBuffers.skills
      .flatMap(s => s.split(/•|,|\||\n/))
      .map(s => s.trim())
      .filter(s => s.length > 1 && !s.toLowerCase().includes('skills'));
  }

  // Parse Experience
  const expLines = sectionBuffers.experience;
  let currentExp = null;

  for (let i = 0; i < expLines.length; i++) {
    const line = expLines[i];
    // Date pattern detector e.g., "Jan 2020 - Present", "2018 - 2021"
    const dateMatch = line.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})\s*(\d{4})?\s*[-–—]\s*(Present|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})?/i);

    if (dateMatch || (i > 0 && expLines[i-1].length > 3 && line.length < 35 && line.includes(' - '))) {
      if (currentExp && currentExp.title) {
        profile.experiences.push(currentExp);
      }
      currentExp = {
        id: 'exp-' + Math.random().toString(36).substring(2, 9),
        title: i > 0 ? expLines[i-1] : 'Role',
        company: i > 1 ? expLines[i-2] : 'Company',
        startDate: dateMatch ? dateMatch[0] : 'Dates',
        endDate: '',
        location: '',
        description: ''
      };
    } else if (currentExp) {
      currentExp.description += (currentExp.description ? '\n' : '') + line;
    }
  }
  if (currentExp && currentExp.title) {
    profile.experiences.push(currentExp);
  }

  // Parse Education
  const eduLines = sectionBuffers.education;
  let currentEdu = null;

  for (let i = 0; i < eduLines.length; i++) {
    const line = eduLines[i];
    const dateMatch = line.match(/\d{4}\s*[-–—]\s*\d{4}/);
    if (dateMatch) {
      if (currentEdu) profile.education.push(currentEdu);
      currentEdu = {
        id: 'edu-' + Math.random().toString(36).substring(2, 9),
        school: i > 0 ? eduLines[i-1] : 'University',
        degree: i > 1 ? eduLines[i-2] : 'Degree',
        startDate: dateMatch[0].split('-')[0].trim(),
        endDate: dateMatch[0].split('-')[1]?.trim() || '',
        description: ''
      };
    } else if (currentEdu) {
      currentEdu.description += (currentEdu.description ? ' ' : '') + line;
    }
  }
  if (currentEdu && currentEdu.school) {
    profile.education.push(currentEdu);
  }

  // Fallback defaults if sections were empty
  if (profile.experiences.length === 0 && expLines.length > 0) {
    profile.experiences.push({
      id: 'exp-fallback',
      title: 'Professional Experience',
      company: 'Extracted Organization',
      startDate: 'Recent',
      endDate: 'Present',
      description: expLines.join('\n')
    });
  }

  return profile;
}
