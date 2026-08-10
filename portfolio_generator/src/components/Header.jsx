import React from 'react';
import { FileText, CheckCircle2, Layout, RotateCcw, Download } from 'lucide-react';

export default function Header({ currentStep, setStep, onReset, onExportJson }) {
  return (
    <header className="app-header no-print">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <img
          src="/logo.jpg"
          alt="DualTech Diaries Logo"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid rgba(99, 102, 241, 0.5)',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
            background: '#ffffff'
          }}
        />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: "'Sora', sans-serif", letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              DualTech Portfolio
            </h2>
            <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#c7d2fe', fontFamily: "'Space Grotesk', sans-serif", fontWeight: '600' }}>
              by Srigayathri Rajkumar
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'Space Grotesk', sans-serif" }}>
            Bridging Heritage & Technology • LinkedIn PDF → Portfolio
          </p>
        </div>
      </div>

      {/* Step Progress Bar */}
      <div className="step-bar">
        <button
          onClick={() => setStep('upload')}
          className={`step-item ${currentStep === 'upload' ? 'active' : currentStep !== 'upload' ? 'completed' : ''}`}
        >
          <FileText size={15} />
          1. Drop PDF 📄
        </button>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <button
          onClick={() => setStep('edit')}
          className={`step-item ${currentStep === 'edit' ? 'active' : currentStep === 'preview' ? 'completed' : ''}`}
        >
          <CheckCircle2 size={15} />
          2. Fine-Tune & Flex ✏️
        </button>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <button
          onClick={() => setStep('preview')}
          className={`step-item ${currentStep === 'preview' ? 'active' : ''}`}
        >
          <Layout size={15} />
          3. Serve & Launch 🚀
        </button>
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onExportJson}
          className="btn btn-secondary btn-sm"
          title="Export Data as JSON file"
        >
          <Download size={14} />
          Export JSON
        </button>

        <button
          onClick={onReset}
          className="btn btn-ghost btn-sm"
          title="Start fresh with a new profile"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>
    </header>
  );
}
