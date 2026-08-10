import React from 'react';
import { Sparkles, FileText, CheckCircle2, Layout, RotateCcw, Download, Eye } from 'lucide-react';

export default function Header({ currentStep, setStep, onReset, onExportJson }) {
  return (
    <header className="app-header no-print">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'var(--accent-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <Sparkles size={20} color="#ffffff" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            DualTech Portfolio
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            LinkedIn PDF → Resume & Portfolio
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
          1. Upload
        </button>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <button
          onClick={() => setStep('edit')}
          className={`step-item ${currentStep === 'edit' ? 'active' : currentStep === 'preview' ? 'completed' : ''}`}
        >
          <CheckCircle2 size={15} />
          2. Review & Edit
        </button>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <button
          onClick={() => setStep('preview')}
          className={`step-item ${currentStep === 'preview' ? 'active' : ''}`}
        >
          <Layout size={15} />
          3. Live Portfolio & Resume
        </button>
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onExportJson}
          className="btn btn-secondary btn-sm"
          title="Export Data as JSON"
        >
          <Download size={14} />
          Export JSON
        </button>

        <button
          onClick={onReset}
          className="btn btn-ghost btn-sm"
          title="Reset to New Profile"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>
    </header>
  );
}
