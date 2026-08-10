import React, { useState } from 'react';
import { ExternalLink, Github, Linkedin, Mail, MapPin, Globe, Sparkles, Monitor, Smartphone, Copy, Check, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PortfolioViewer({ profile, theme, onSwitchToResume }) {
  const [viewMode, setViewMode] = useState('desktop'); // desktop | mobile
  const [copiedLink, setCopiedLink] = useState(false);

  const slug = (profile.name || 'portfolio').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const portfolioUrl = `https://portfolio.dev/p/${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(portfolioUrl);
    setCopiedLink(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div>
      {/* Portfolio Header Bar */}
      <div className="no-print" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        background: 'rgba(255,255,255,0.05)',
        padding: '16px 24px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Shareable Portfolio URL</div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={16} /> {portfolioUrl}
            </div>
          </div>
          <button onClick={handleCopyLink} className="btn btn-secondary btn-sm">
            {copiedLink ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            {copiedLink ? 'Copied!' : 'Copy Share Link'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Responsive Preview Switcher */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', padding: '4px' }}>
            <button
              onClick={() => setViewMode('desktop')}
              className={`btn btn-sm ${viewMode === 'desktop' ? 'btn-secondary' : 'btn-ghost'}`}
            >
              <Monitor size={14} /> Desktop View
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`btn btn-sm ${viewMode === 'mobile' ? 'btn-secondary' : 'btn-ghost'}`}
            >
              <Smartphone size={14} /> Mobile View
            </button>
          </div>

          <button onClick={onSwitchToResume} className="btn btn-primary btn-sm">
            <FileText size={16} /> View & Download PDF Resume
          </button>
        </div>
      </div>

      {/* Portfolio Preview Container */}
      <div style={{
        maxWidth: viewMode === 'mobile' ? '420px' : '1100px',
        margin: '0 auto',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* THEME 1: MODERN TECH (DARK GLASSMORPHISM) */}
        {theme === 'modern-tech' && (
          <div style={{
            background: '#0b0f19',
            color: '#f3f4f6',
            padding: '56px 40px',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}>
            {/* Hero Banner */}
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center', marginBottom: '60px', flexWrap: 'wrap' }}>
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  style={{ width: '120px', height: '120px', borderRadius: '24px', objectFit: 'cover', border: '2px solid var(--accent-primary)', boxShadow: 'var(--shadow-glow)' }}
                />
              ) : (
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '24px',
                  background: 'var(--accent-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  fontWeight: '800'
                }}>
                  {profile.name?.charAt(0)}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <span className="badge" style={{ marginBottom: '8px' }}>Available for hire</span>
                <h1 style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '8px' }}>{profile.name}</h1>
                <p style={{ fontSize: '1.25rem', color: '#a5b4fc', fontWeight: '600' }}>{profile.headline}</p>
                <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginTop: '6px' }}><MapPin size={14} inline /> {profile.location}</p>
              </div>
            </div>

            {/* About */}
            {profile.summary && (
              <div style={{ marginBottom: '48px' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                  // About Me
                </h3>
                <p style={{ fontSize: '1.1rem', color: '#d1d5db', lineHeight: '1.7' }}>
                  {profile.summary}
                </p>
              </div>
            )}

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div style={{ marginBottom: '48px' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
                  // Tech Stack & Skills
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {profile.skills.map((skill, idx) => (
                    <span key={idx} style={{
                      padding: '8px 16px',
                      borderRadius: '12px',
                      background: 'rgba(31, 41, 55, 0.8)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      color: '#f3f4f6',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {profile.experiences && profile.experiences.length > 0 && (
              <div style={{ marginBottom: '48px' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '24px' }}>
                  // Experience
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {profile.experiences.map((exp, idx) => (
                    <div key={idx} className="glass-card" style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{exp.title}</h4>
                        <span style={{ color: '#a5b4fc', fontSize: '0.9rem' }}>{exp.startDate} – {exp.endDate}</span>
                      </div>
                      <div style={{ color: '#9ca3af', fontWeight: '600', marginBottom: '12px' }}>{exp.company}</div>
                      <p style={{ color: '#d1d5db', fontSize: '0.95rem', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* THEME 2: EXECUTIVE MINIMALIST (EDITORIAL LIGHT) */}
        {theme === 'executive-minimal' && (
          <div style={{
            background: '#fafaf9',
            color: '#1c1917',
            padding: '60px 48px',
            fontFamily: "'Playfair Display', serif"
          }}>
            <div style={{ borderBottom: '2px solid #1c1917', paddingBottom: '32px', marginBottom: '48px' }}>
              <h1 style={{ fontSize: '3.4rem', fontWeight: '700', color: '#0c0a09', marginBottom: '8px' }}>
                {profile.name}
              </h1>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.3rem', color: '#57534e' }}>
                {profile.headline}
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#78716c', marginTop: '8px' }}>
                {profile.location} {profile.email && `• ${profile.email}`}
              </p>
            </div>

            {profile.summary && (
              <div style={{ marginBottom: '48px', maxWidth: '800px' }}>
                <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a8a29e', marginBottom: '16px' }}>
                  Biography
                </h3>
                <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: '#292524' }}>
                  {profile.summary}
                </p>
              </div>
            )}

            {profile.experiences && profile.experiences.length > 0 && (
              <div style={{ marginBottom: '48px' }}>
                <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a8a29e', marginBottom: '24px' }}>
                  Leadership & Career
                </h3>
                {profile.experiences.map((exp, idx) => (
                  <div key={idx} style={{ marginBottom: '32px', borderLeft: '2px solid #e7e5e4', paddingLeft: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Inter', sans-serif" }}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0c0a09' }}>{exp.title} — {exp.company}</h4>
                      <span style={{ color: '#78716c', fontSize: '0.9rem' }}>{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p style={{ fontFamily: "'Inter', sans-serif", color: '#44403c', fontSize: '0.95rem', marginTop: '8px', lineHeight: '1.6' }}>
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* THEME 3: CREATIVE STUDIO (VIBRANT GRADIENT) */}
        {theme === 'creative-studio' && (
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #311b92 50%, #4a148c 100%)',
            color: '#ffffff',
            padding: '56px 40px',
            fontFamily: "'Outfit', sans-serif"
          }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <h1 style={{ fontSize: '3.6rem', fontWeight: '800', background: 'linear-gradient(to right, #67e8f9, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {profile.name}
              </h1>
              <p style={{ fontSize: '1.4rem', color: '#e0e7ff', marginTop: '8px' }}>
                {profile.headline}
              </p>
            </div>

            {profile.skills && (
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '48px' }}>
                {profile.skills.map((s, i) => (
                  <span key={i} style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '10px 20px', borderRadius: '30px', fontWeight: '600' }}>
                    ⚡ {s}
                  </span>
                ))}
              </div>
            )}

            {profile.experiences && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {profile.experiences.map((exp, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <h4 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{exp.title}</h4>
                    <div style={{ color: '#f472b6', fontWeight: '600', fontSize: '0.9rem', marginBottom: '12px' }}>{exp.company} ({exp.startDate})</div>
                    <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.5' }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* THEME 4: SWISS GRID (MONOCHROME CLEAN) */}
        {theme === 'swiss-grid' && (
          <div style={{
            background: '#121212',
            color: '#e5e5e5',
            padding: '56px 40px',
            fontFamily: "'Fira Code', monospace"
          }}>
            <div style={{ borderBottom: '1px dashed #444', paddingBottom: '32px', marginBottom: '32px' }}>
              <div style={{ color: '#10b981', fontSize: '0.9rem', marginBottom: '8px' }}>[SYSTEM_PROFILE_INITIALIZED]</div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>{profile.name}</h1>
              <p style={{ color: '#a3a3a3', fontSize: '1.1rem', marginTop: '6px' }}>{profile.headline}</p>
            </div>

            {profile.summary && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ color: '#10b981', marginBottom: '8px' }}>$ cat summary.txt</div>
                <p style={{ color: '#d4d4d4', fontSize: '0.95rem', lineHeight: '1.6' }}>{profile.summary}</p>
              </div>
            )}

            {profile.experiences && (
              <div>
                <div style={{ color: '#10b981', marginBottom: '16px' }}>$ cat experience.json</div>
                {profile.experiences.map((exp, idx) => (
                  <div key={idx} style={{ marginBottom: '20px', borderLeft: '2px solid #10b981', paddingLeft: '16px' }}>
                    <div style={{ fontWeight: '700', color: '#ffffff' }}>{exp.title} @ {exp.company}</div>
                    <div style={{ fontSize: '0.8rem', color: '#a3a3a3' }}>{exp.startDate} - {exp.endDate}</div>
                    <p style={{ fontSize: '0.85rem', color: '#a3a3a3', marginTop: '6px' }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
