import React from 'react';
import { Palette, Sparkles, Check } from 'lucide-react';

export const THEMES = [
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    category: 'Dark Mode Flex ⚡',
    desc: 'Cyberpunk glass cards, neon accents, and dark aesthetic for developers & tech engineers.',
    previewBg: 'linear-gradient(135deg, #0b0f19, #1f2937)',
    accent: '#6366f1'
  },
  {
    id: 'executive-minimal',
    name: 'Executive Minimalist',
    category: 'Quiet Luxury 🏛️',
    desc: 'Ivory backdrop, editorial serif headers, and spacious layout for senior leaders & executives.',
    previewBg: 'linear-gradient(135deg, #fafaf9, #f3f4f6)',
    accent: '#0f172a'
  },
  {
    id: 'creative-studio',
    name: 'Creative Studio',
    category: 'Bold & Iconic 🎨',
    desc: 'Vibrant gradients, playful card styling, and interactive hover effects for designers & creators.',
    previewBg: 'linear-gradient(135deg, #3b82f6, #ec4899)',
    accent: '#ec4899'
  },
  {
    id: 'swiss-grid',
    name: 'Swiss Grid',
    category: 'Clean Code Energy 💻',
    desc: 'Monochrome terminal vibe, sharp grid structure, and ultra-readable monospace typography.',
    previewBg: 'linear-gradient(135deg, #111111, #222222)',
    accent: '#10b981'
  }
];

export default function ThemeSelector({ activeTheme, onSelectTheme }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Palette size={22} color="var(--accent-primary)" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: "'Sora', sans-serif" }}>Select Your Vibe & Theme</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>
        {THEMES.map((theme) => {
          const isSelected = activeTheme === theme.id;
          return (
            <div
              key={theme.id}
              onClick={() => onSelectTheme(theme.id)}
              className="glass-card"
              style={{
                padding: '18px',
                cursor: 'pointer',
                border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)'}`,
                background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                transition: 'var(--transition-fast)'
              }}
            >
              <div style={{
                height: '64px',
                borderRadius: 'var(--radius-md)',
                background: theme.previewBg,
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {isSelected && (
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-glow)'
                  }}>
                    <Check size={18} color="#ffffff" />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', fontFamily: "'Sora', sans-serif" }}>{theme.name}</h4>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <span className="badge" style={{ fontSize: '0.75rem', padding: '3px 10px' }}>
                  {theme.category}
                </span>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.45', fontFamily: "'Space Grotesk', sans-serif" }}>
                {theme.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
