import React from 'react';
import { Download, Printer, Mail, MapPin, Globe, Github, Linkedin, Phone } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function ResumePDFView({ profile }) {
  const handleDownloadPDF = () => {
    const element = document.getElementById('resume-pdf-document');
    const opt = {
      margin: 10,
      filename: `${profile.name.toLowerCase().replace(/\s+/g, '_')}_resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Controls Header */}
      <div className="no-print" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        background: 'rgba(255,255,255,0.05)',
        padding: '16px 24px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)'
      }}>
        <div>
          <h3 style={{ fontSize: '1.1rem' }}>ATS-Formatted Resume PDF</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ready for instant print & PDF export</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handlePrint} className="btn btn-secondary btn-sm">
            <Printer size={16} /> Print Resume
          </button>
          <button onClick={handleDownloadPDF} className="btn btn-primary btn-sm">
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      {/* Resume A4 Document Paper Preview */}
      <div
        id="resume-pdf-document"
        className="resume-print-container"
        style={{
          background: '#ffffff',
          color: '#1e293b',
          fontFamily: "'Inter', sans-serif",
          padding: '40px 48px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          maxWidth: '850px',
          margin: '0 auto'
        }}
      >
        {/* Resume Header */}
        <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '16px', marginBottom: '20px' }}>
          <h1 style={{ color: '#0f172a', fontSize: '2.2rem', fontWeight: '800', margin: 0 }}>
            {profile.name}
          </h1>
          <p style={{ color: '#475569', fontSize: '1.1rem', fontWeight: '600', marginTop: '4px' }}>
            {profile.headline}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '12px', fontSize: '0.85rem', color: '#64748b' }}>
            {profile.location && <span><MapPin size={12} inline /> {profile.location}</span>}
            {profile.email && <span><Mail size={12} inline /> {profile.email}</span>}
            {profile.phone && <span><Phone size={12} inline /> {profile.phone}</span>}
            {profile.github && <span><Github size={12} inline /> {profile.github}</span>}
            {profile.linkedin && <span><Linkedin size={12} inline /> {profile.linkedin}</span>}
          </div>
        </div>

        {/* Executive Summary */}
        {profile.summary && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '8px' }}>
              Professional Summary
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>
              {profile.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {profile.experiences && profile.experiences.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '12px' }}>
              Work Experience
            </h2>

            {profile.experiences.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontSize: '1rem', color: '#0f172a', fontWeight: '700', margin: 0 }}>
                    {exp.title} <span style={{ fontWeight: '400', color: '#475569' }}>| {exp.company}</span>
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>
                    {exp.startDate} – {exp.endDate || 'Present'}
                  </span>
                </div>
                {exp.description && (
                  <p style={{ fontSize: '0.88rem', color: '#334155', marginTop: '6px', whiteSpace: 'pre-line', lineHeight: '1.45' }}>
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Technical Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '8px' }}>
              Skills & Expertise
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.6' }}>
              {profile.skills.join('  •  ')}
            </p>
          </div>
        )}

        {/* Education */}
        {profile.education && profile.education.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '12px' }}>
              Education
            </h2>
            {profile.education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{edu.school}</strong>
                  <div style={{ fontSize: '0.88rem', color: '#475569' }}>{edu.degree}</div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {edu.startDate} – {edu.endDate}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
