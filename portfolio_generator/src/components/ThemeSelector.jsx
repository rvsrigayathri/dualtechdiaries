import React from 'react';
import { Palette, Sparkles, Check } from 'lucide-react';

export const THEMES = [
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    category: 'Dark Glassmorphism',
    desc: 'Cyberpunk glow, glass floating cards, high-contrast dark theme for tech stack showcases.',
    previewBg: 'linear-gradient(135deg, #0b0f19, #1f2937)',
    accent: '#6366f1'
  },
  {
    id: 'executive-minimal',
    name: 'Executive Minimalist',
    category: 'Editorial Light',
    desc: 'Warm ivory backdrop, serif typography, high-end editorial layout for senior leaders.',
    previewBg: 'linear-gradient(135deg, #fafaf9, #f3f4f6)',
    accent: '#0f172a'
  },
  {
    id: 'creative-studio',
    name: 'Creative Studio',
    category: 'Vibrant Dynamic Gradient',
    desc: 'Bold colors, playful hover effects, and vibrant card highlights for designers & innovators.',
    previewBg: 'linear-gradient(135deg, #3b82f6, #ec4899)',
    accent: '#ec4899'
  },
  {
    id: 'swiss-grid',
    name: 'Swiss Grid',
    category: 'Monochrome Clean',
    desc: 'Ultra-structured grid layout, sharp typographic hierarchy, and minimalist design.',
    previewBg: 'linear-gradient(135deg, #111111, #222222)',
    accent: '#10b981'
  }
];

export default function ThemeSelector({ activeTheme, onSelectTheme }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Palette size={20} color="var(--accent-primary)" />
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Choose Portfolio Theme</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {THEMES.map((theme) => {
          const isSelected = activeTheme === theme.id;
          return (
            <div
              key={theme.id}
              onClick={() => onSelectTheme(theme.id)}
              className="glass-card"
              style={{
                padding: '16px',
                cursor: 'pointer',
                border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)'}`,
                background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                transition: 'var(--transition-fast)'
              }}
            >
              <div style={{
                height: '60px',
                borderRadius: 'var(--radius-md)',
                background: theme.previewBg,
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {isSelected && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-glow)'
                  }}>
                    <Check size={16} color="#ffffff" />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>{theme.name}</h4>
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                  {theme.category}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.4' }}>
                {theme.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
