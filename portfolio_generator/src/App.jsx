import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingHero from './components/LandingHero';
import ReviewEditForm from './components/ReviewEditForm';
import ThemeSelector from './components/ThemeSelector';
import PortfolioViewer from './components/PortfolioViewer';
import ResumePDFView from './components/ResumePDFView';
import { sampleProfile } from './utils/sampleData';

const LOCAL_STORAGE_KEY = 'dualtech_portfolio_data';

export default function App() {
  const [step, setStep] = useState('upload'); // 'upload' | 'edit' | 'preview' | 'resume'
  const [profile, setProfile] = useState(sampleProfile);
  const [theme, setTheme] = useState('modern-tech');
  const [subView, setSubView] = useState('portfolio'); // 'portfolio' | 'resume'

  // Load persisted profile state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load profile state:', e);
    }
  }, []);

  // Save profile state on change
  const updateProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProfile));
    } catch (e) {
      console.error('Failed to save profile state:', e);
    }
  };

  // Upload handler
  const handleProfileParsed = (parsedProfile) => {
    updateProfile(parsedProfile);
    setStep('edit');
  };

  // Demo loader handler
  const handleLoadSample = () => {
    updateProfile(sampleProfile);
    setStep('edit');
  };

  // Reset handler
  const handleReset = () => {
    if (window.confirm('Reset current profile data and start over?')) {
      setProfile(sampleProfile);
      setStep('upload');
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  // JSON Export handler
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${(profile.name || 'profile').toLowerCase().replace(/\s+/g, '_')}_data.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        currentStep={step === 'resume' ? 'preview' : step}
        setStep={setStep}
        onReset={handleReset}
        onExportJson={handleExportJson}
      />

      <main className="app-container" style={{ flex: 1, paddingBottom: '60px' }}>
        {/* STEP 1: LANDING & UPLOAD */}
        {step === 'upload' && (
          <LandingHero
            onProfileParsed={handleProfileParsed}
            onLoadSample={handleLoadSample}
          />
        )}

        {/* STEP 2: REVIEW & EDIT */}
        {step === 'edit' && (
          <ReviewEditForm
            profile={profile}
            onUpdateProfile={updateProfile}
            onProceedToPreview={() => setStep('preview')}
          />
        )}

        {/* STEP 3: LIVE PORTFOLIO & RESUME PDF */}
        {(step === 'preview' || step === 'resume') && (
          <div className="animate-fade-in" style={{ paddingTop: '32px' }}>
            <ThemeSelector activeTheme={theme} onSelectTheme={setTheme} />

            {/* View Subtabs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }} className="no-print">
              <button
                onClick={() => setSubView('portfolio')}
                className={`btn ${subView === 'portfolio' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Interactive Portfolio Website
              </button>
              <button
                onClick={() => setSubView('resume')}
                className={`btn ${subView === 'resume' ? 'btn-primary' : 'btn-secondary'}`}
              >
                ATS PDF Resume Format
              </button>
            </div>

            {subView === 'portfolio' ? (
              <PortfolioViewer
                profile={profile}
                theme={theme}
                onSwitchToResume={() => setSubView('resume')}
              />
            ) : (
              <ResumePDFView profile={profile} />
            )}
          </div>
        )}
      </main>

      <footer className="no-print" style={{
        borderTop: '1px solid var(--border-color)',
        padding: '24px 0',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-dim)',
        background: 'rgba(11, 15, 25, 0.9)'
      }}>
        DualTech Portfolio & Resume Generator • Modern Client-Side Engine
      </footer>
    </div>
  );
}
