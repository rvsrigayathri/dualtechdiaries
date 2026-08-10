import React, { useState, useCallback } from 'react';
import { UploadCloud, FileCheck, ArrowRight, ShieldCheck, Zap, Palette, FileText, CheckCircle2, Sparkles, Flame, Check } from 'lucide-react';
import { extractTextFromPDF, parseLinkedInText } from '../utils/linkedinParser';

export default function LandingHero({ onProfileParsed, onLoadSample }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const processFile = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      setErrorMsg('Please select a valid LinkedIn export PDF file.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    try {
      const { fullText } = await extractTextFromPDF(file);
      const parsedData = parseLinkedInText(fullText);
      onProfileParsed(parsedData);
    } catch (err) {
      console.error('PDF parsing error:', err);
      setErrorMsg('Could not parse this PDF. Try uploading another LinkedIn PDF export or load the demo profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  return (
    <div className="animate-fade-in" style={{ padding: '60px 0 80px 0' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 48px auto' }}>
        <div className="badge" style={{ marginBottom: '20px', padding: '6px 16px', fontSize: '0.85rem' }}>
          <Flame size={14} color="#f43f5e" /> Main Character Energy for Your Career • No Cap
        </div>
        <h1 style={{ fontSize: '3.4rem', fontWeight: '800', fontFamily: "'Sora', sans-serif", letterSpacing: '-0.03em', marginBottom: '20px', lineHeight: '1.15' }}>
          Turn Your LinkedIn PDF Into a <span className="gradient-text">Stunning Portfolio & Resume</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.6', fontFamily: "'Space Grotesk', sans-serif" }}>
          Drop your LinkedIn export PDF below. Our client-side parser extracts your work history, projects, and skills to generate a high-converting website & ATS-friendly resume in seconds.
        </p>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div style={{ maxWidth: '680px', margin: '0 auto 40px auto' }}>
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className="glass-card"
          style={{
            padding: '48px 36px',
            textAlign: 'center',
            cursor: 'pointer',
            border: `2px dashed ${isDragging ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.18)'}`,
            background: isDragging ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-card)',
            transition: 'var(--transition-smooth)',
            transform: isDragging ? 'scale(1.02)' : 'none'
          }}
          onClick={() => document.getElementById('linkedinPdfInput').click()}
        >
          <input
            id="linkedinPdfInput"
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files[0] && processFile(e.target.files[0])}
          />

          {isLoading ? (
            <div style={{ padding: '20px 0' }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid rgba(255,255,255,0.1)',
                borderTopColor: 'var(--accent-primary)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px auto'
              }} />
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Letting Us Cook... Extracting PDF 🍳</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Parsing experience, credentials, skills, and headline</p>
            </div>
          ) : (
            <>
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '20px',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                boxShadow: 'var(--shadow-glow)'
              }}>
                <UploadCloud size={34} color="#818cf8" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', fontFamily: "'Sora', sans-serif", marginBottom: '8px' }}>
                Drop Your LinkedIn "Save to PDF" Export Here
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px', fontFamily: "'Space Grotesk', sans-serif" }}>
                or click to select your PDF file from your device
              </p>
              <span className="btn btn-secondary btn-sm" style={{ padding: '10px 20px', borderRadius: 'var(--radius-full)' }}>
                📁 Choose LinkedIn PDF
              </span>
            </>
          )}
        </div>

        {errorMsg && (
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: 'var(--radius-md)',
            color: '#fca5a5',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {errorMsg}
          </div>
        )}

        {/* Demo Button */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '12px' }}>
            No LinkedIn PDF handy? Test drive the full workflow instantly!
          </p>
          <button
            onClick={onLoadSample}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '16px 28px', fontSize: '1.05rem', borderRadius: 'var(--radius-md)' }}
          >
            <Sparkles size={18} />
            Try Instant Demo (See the Magic in 1-Click)
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* 3 Step Process Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        maxWidth: '1020px',
        margin: '60px auto 0 auto'
      }}>
        <div className="glass-card" style={{ padding: '28px' }}>
          <div className="badge" style={{ marginBottom: '14px' }}>Step 1 📄</div>
          <h4 style={{ fontSize: '1.15rem', marginBottom: '8px', fontFamily: "'Sora', sans-serif" }}>Upload LinkedIn PDF</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Go to your LinkedIn profile → Click "More" → "Save to PDF". Drop it here and let our engine parse your data.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '28px' }}>
          <div className="badge" style={{ marginBottom: '14px' }}>Step 2 ✏️</div>
          <h4 style={{ fontSize: '1.15rem', marginBottom: '8px', fontFamily: "'Sora', sans-serif" }}>Fine-Tune Details</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Review parsed experience, tweak copy, add portfolio projects, set your profile photo, and highlight top tech stack tags.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '28px' }}>
          <div className="badge" style={{ marginBottom: '14px' }}>Step 3 🚀</div>
          <h4 style={{ fontSize: '1.15rem', marginBottom: '8px', fontFamily: "'Sora', sans-serif" }}>Serve & Share</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Choose from 4 custom aesthetics, launch your interactive portfolio website, and export a clean ATS PDF resume.
          </p>
        </div>
      </div>
    </div>
  );
}
