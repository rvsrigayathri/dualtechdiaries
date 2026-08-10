import React, { useState, useCallback } from 'react';
import { UploadCloud, FileCheck, ArrowRight, ShieldCheck, Zap, Palette, FileText, CheckCircle2, Sparkles } from 'lucide-react';
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
      <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 48px auto' }}>
        <div className="badge" style={{ marginBottom: '20px' }}>
          <Zap size={14} /> Next-Gen AI Portfolio & Resume Builder
        </div>
        <h1 style={{ fontSize: '3.2rem', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '20px', lineHeight: '1.15' }}>
          Turn Your <span className="gradient-text">LinkedIn Profile</span> into a Stunning Portfolio & Resume
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          Export your LinkedIn to PDF, drag & drop it below, and get a handcrafted portfolio site with matching ATS-ready resume in seconds.
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
            border: `2px dashed ${isDragging ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.15)'}`,
            background: isDragging ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-card)',
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
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Parsing LinkedIn Profile PDF...</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Extracting experience, education, skills, and headline</p>
            </div>
          ) : (
            <>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <UploadCloud size={32} color="#818cf8" />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' }}>
                Drag & Drop LinkedIn "Save to PDF" Here
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px' }}>
                or click to browse files from your computer
              </p>
              <span className="btn btn-secondary btn-sm">
                Select PDF File
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
            Don't have a LinkedIn PDF ready right now?
          </p>
          <button
            onClick={onLoadSample}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Sparkles size={18} />
            Try Instant Demo with Sample LinkedIn Profile
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* 3 Step Process Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px',
        maxWidth: '1000px',
        margin: '60px auto 0 auto'
      }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div className="badge" style={{ marginBottom: '12px' }}>Step 1</div>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Upload Export</h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Go to your LinkedIn Profile → Click "More" → "Save to PDF", then upload it here.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div className="badge" style={{ marginBottom: '12px' }}>Step 2</div>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Review & Edit</h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Refine extracted text, add custom projects, fine-tune skills, and upload your profile photo.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div className="badge" style={{ marginBottom: '12px' }}>Step 3</div>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Generate & Export</h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Choose from 4 custom design themes, launch your live portfolio, and download a matching PDF resume.
          </p>
        </div>
      </div>
    </div>
  );
}
