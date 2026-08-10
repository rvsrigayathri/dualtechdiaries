export const sampleProfile = {
  name: "Alex Rivera",
  headline: "Senior Full Stack Engineer & Cloud Architect",
  location: "San Francisco, CA (Open to Remote)",
  email: "alex.rivera.dev@example.com",
  phone: "+1 (555) 234-5678",
  website: "https://alexrivera.dev",
  github: "github.com/alexrivera-dev",
  linkedin: "linkedin.com/in/alexrivera-dev",
  summary: "Senior Full Stack Engineer with 7+ years of experience designing high-availability web architectures, distributed real-time systems, and scalable cloud platforms. Passionate about modern JavaScript/TypeScript ecosystems, cloud-native deployments, UI/UX aesthetics, and high-throughput backend APIs.",
  photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  skills: [
    "React", "TypeScript", "Node.js", "Java / Spring Boot", 
    "Python", "GraphQL", "PostgreSQL", "MongoDB", 
    "Docker & Kubernetes", "AWS / Cloudflare", "TailwindCSS & Modern CSS", 
    "System Architecture", "CI/CD Pipelines", "Web Performance"
  ],
  experiences: [
    {
      id: "exp-1",
      title: "Lead Full Stack Engineer",
      company: "Nexus Tech Solutions",
      location: "San Francisco, CA",
      startDate: "Jan 2022",
      endDate: "Present",
      description: "• Architected multi-tenant SaaS analytics platform handling 15M+ daily API requests using React, Spring Boot, and PostgreSQL.\n• Reduced page load times by 62% by introducing server-side rendering, code splitting, and Cloudflare edge caching.\n• Managed an engineering squad of 6 developers, conducting code reviews and championing CI/CD best practices."
    },
    {
      id: "exp-2",
      title: "Senior Frontend Engineer",
      company: "CloudScale Software",
      location: "San Jose, CA",
      startDate: "Mar 2019",
      endDate: "Dec 2021",
      description: "• Spearheaded redesign of core web dashboard with React, Redux Toolkit, and custom design tokens.\n• Integrated WebSocket microservices for real-time collaboration tools used by 80,000 active enterprise users.\n• Authored comprehensive unit/integration test suites (Jest/Cypress), raising overall codebase coverage from 45% to 88%."
    },
    {
      id: "exp-3",
      title: "Software Engineer",
      company: "Apex Web Labs",
      location: "Oakland, CA",
      startDate: "Jun 2017",
      endDate: "Feb 2019",
      description: "• Developed RESTful backend APIs in Node.js/Express and built client dashboards in React.\n• Implemented automated PDF report generation service used by sales and compliance teams."
    }
  ],
  education: [
    {
      id: "edu-1",
      school: "University of California, Berkeley",
      degree: "B.S. Computer Science & Data Science",
      startDate: "2013",
      endDate: "2017",
      description: "Graduated with Honors. Co-founder of HackCal Student Tech Club."
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "PulseFlow - Real-time Dev Metrics",
      description: "Open-source telemetry dashboard for monitoring microservice API latency, error budgets, and system health.",
      link: "https://pulseflow-demo.example.com",
      tags: ["React", "Go", "WebSocket", "Docker"]
    },
    {
      id: "proj-2",
      title: "Aura Design System",
      description: "Accessible, high-performance UI component library built for React & web components with dark mode support.",
      link: "https://aura-ui-demo.example.com",
      tags: ["TypeScript", "Vanilla CSS", "Storybook"]
    }
  ]
};
