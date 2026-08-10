import React, { useState } from 'react';
import { User, Briefcase, GraduationCap, Code, Globe, Plus, Trash2, ArrowRight, CheckCircle, Image as ImageIcon } from 'lucide-react';

export default function ReviewEditForm({ profile, onUpdateProfile, onProceedToPreview }) {
  const [activeTab, setActiveTab] = useState('personal');

  // Helper change handlers
  const handleChange = (field, value) => {
    onUpdateProfile({ ...profile, [field]: value });
  };

  // Experience Handlers
  const handleExpChange = (index, field, value) => {
    const updated = [...profile.experiences];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateProfile({ ...profile, experiences: updated });
  };

  const addExperience = () => {
    const newExp = {
      id: 'exp-' + Date.now(),
      title: 'New Position',
      company: 'Company Name',
      startDate: 'Jan 2023',
      endDate: 'Present',
      description: 'Key achievements and responsibilities...'
    };
    onUpdateProfile({ ...profile, experiences: [newExp, ...profile.experiences] });
  };

  const removeExperience = (index) => {
    const updated = profile.experiences.filter((_, i) => i !== index);
    onUpdateProfile({ ...profile, experiences: updated });
  };

  // Education Handlers
  const handleEduChange = (index, field, value) => {
    const updated = [...profile.education];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateProfile({ ...profile, education: updated });
  };

  const addEducation = () => {
    const newEdu = {
      id: 'edu-' + Date.now(),
      school: 'University Name',
      degree: 'Bachelor of Science in CS',
      startDate: '2019',
      endDate: '2023',
      description: ''
    };
    onUpdateProfile({ ...profile, education: [...profile.education, newEdu] });
  };

  const removeEducation = (index) => {
    const updated = profile.education.filter((_, i) => i !== index);
    onUpdateProfile({ ...profile, education: updated });
  };

  // Skill Handlers
  const [newSkillInput, setNewSkillInput] = useState('');
  const addSkill = () => {
    if (!newSkillInput.trim()) return;
    if (!profile.skills.includes(newSkillInput.trim())) {
      onUpdateProfile({ ...profile, skills: [...profile.skills, newSkillInput.trim()] });
    }
    setNewSkillInput('');
  };

  const removeSkill = (skillToRemove) => {
    onUpdateProfile({
      ...profile,
      skills: profile.skills.filter(s => s !== skillToRemove)
    });
  };

  // Project Handlers
  const handleProjChange = (index, field, value) => {
    const updated = [...(profile.projects || [])];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateProfile({ ...profile, projects: updated });
  };

  const addProject = () => {
    const newProj = {
      id: 'proj-' + Date.now(),
      title: 'Featured Project',
      description: 'Built a web application for real-time data visualizer.',
      link: 'https://example.com',
      tags: ['React', 'Node.js']
    };
    onUpdateProfile({ ...profile, projects: [...(profile.projects || []), newProj] });
  };

  const removeProject = (index) => {
    const updated = (profile.projects || []).filter((_, i) => i !== index);
    onUpdateProfile({ ...profile, projects: updated });
  };

  return (
    <div className="animate-fade-in" style={{ padding: '36px 0 80px 0' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Review & Refine Profile</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Verify extracted LinkedIn information and add custom projects before choosing your portfolio theme.
          </p>
        </div>
        <button onClick={onProceedToPreview} className="btn btn-primary btn-lg">
          Generate Portfolio & Resume
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Editor Layout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px' }}>
        {/* Navigation Sidebar */}
        <div className="glass-card" style={{ padding: '16px', height: 'fit-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={() => setActiveTab('personal')}
              className={`btn ${activeTab === 'personal' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ justifyContent: 'flex-start', width: '100%' }}
            >
              <User size={18} /> Personal Details
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`btn ${activeTab === 'experience' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ justifyContent: 'flex-start', width: '100%' }}
            >
              <Briefcase size={18} /> Experience ({profile.experiences?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`btn ${activeTab === 'education' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ justifyContent: 'flex-start', width: '100%' }}
            >
              <GraduationCap size={18} /> Education ({profile.education?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`btn ${activeTab === 'skills' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ justifyContent: 'flex-start', width: '100%' }}
            >
              <Code size={18} /> Skills & Tags ({profile.skills?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`btn ${activeTab === 'projects' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ justifyContent: 'flex-start', width: '100%' }}
            >
              <Globe size={18} /> Portfolio Projects ({profile.projects?.length || 0})
            </button>
          </div>
        </div>

        {/* Form Panel */}
        <div className="glass-card" style={{ padding: '32px' }}>
          {/* TAB 1: PERSONAL DETAILS */}
          {activeTab === 'personal' && (
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                Personal Details & Summary
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={profile.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Headline / Title</label>
                  <input
                    type="text"
                    className="input-field"
                    value={profile.headline}
                    onChange={(e) => handleChange('headline', e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="input-field"
                    value={profile.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="input-field"
                    value={profile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">GitHub URL</label>
                  <input
                    type="text"
                    className="input-field"
                    value={profile.github}
                    onChange={(e) => handleChange('github', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">LinkedIn URL</label>
                  <input
                    type="text"
                    className="input-field"
                    value={profile.linkedin}
                    onChange={(e) => handleChange('linkedin', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Website / Blog</label>
                  <input
                    type="text"
                    className="input-field"
                    value={profile.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Profile Avatar Image URL</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="https://images.unsplash.com/photo..."
                    value={profile.photoUrl}
                    onChange={(e) => handleChange('photoUrl', e.target.value)}
                  />
                  {profile.photoUrl && (
                    <img
                      src={profile.photoUrl}
                      alt="Avatar Preview"
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">About Me / Executive Summary</label>
                <textarea
                  className="input-field"
                  rows={5}
                  value={profile.summary}
                  onChange={(e) => handleChange('summary', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* TAB 2: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Work Experience</h3>
                <button onClick={addExperience} className="btn btn-secondary btn-sm">
                  <Plus size={16} /> Add Position
                </button>
              </div>

              {profile.experiences.map((exp, index) => (
                <div key={exp.id || index} style={{
                  padding: '20px',
                  background: 'rgba(15, 23, 42, 0.4)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--accent-primary)' }}>Position #{index + 1}</h4>
                    <button onClick={() => removeExperience(index)} className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label className="form-label">Job Title</label>
                      <input
                        type="text"
                        className="input-field"
                        value={exp.title}
                        onChange={(e) => handleExpChange(index, 'title', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label">Company Name</label>
                      <input
                        type="text"
                        className="input-field"
                        value={exp.company}
                        onChange={(e) => handleExpChange(index, 'company', e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label className="form-label">Start Date</label>
                      <input
                        type="text"
                        className="input-field"
                        value={exp.startDate}
                        onChange={(e) => handleExpChange(index, 'startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label">End Date</label>
                      <input
                        type="text"
                        className="input-field"
                        value={exp.endDate}
                        onChange={(e) => handleExpChange(index, 'endDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Description & Achievements</label>
                    <textarea
                      className="input-field"
                      rows={3}
                      value={exp.description}
                      onChange={(e) => handleExpChange(index, 'description', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: EDUCATION */}
          {activeTab === 'education' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Education & Credentials</h3>
                <button onClick={addEducation} className="btn btn-secondary btn-sm">
                  <Plus size={16} /> Add Education
                </button>
              </div>

              {profile.education.map((edu, index) => (
                <div key={edu.id || index} style={{
                  padding: '20px',
                  background: 'rgba(15, 23, 42, 0.4)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--accent-primary)' }}>Education #{index + 1}</h4>
                    <button onClick={() => removeEducation(index)} className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label className="form-label">School / Institution</label>
                      <input
                        type="text"
                        className="input-field"
                        value={edu.school}
                        onChange={(e) => handleEduChange(index, 'school', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label">Degree & Major</label>
                      <input
                        type="text"
                        className="input-field"
                        value={edu.degree}
                        onChange={(e) => handleEduChange(index, 'degree', e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="form-label">Dates Attended</label>
                      <input
                        type="text"
                        className="input-field"
                        value={edu.startDate}
                        onChange={(e) => handleEduChange(index, 'startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label">Notes / Honors</label>
                      <input
                        type="text"
                        className="input-field"
                        value={edu.description || ''}
                        onChange={(e) => handleEduChange(index, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: SKILLS */}
          {activeTab === 'skills' && (
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                Skills & Tech Stack
              </h3>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Add a new skill (e.g. React, Kubernetes, PostgreSQL)"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button onClick={addSkill} className="btn btn-secondary">
                  <Plus size={16} /> Add
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {profile.skills.map((skill, i) => (
                  <span key={i} className="badge" style={{ padding: '8px 14px', fontSize: '0.9rem' }}>
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', marginLeft: '6px' }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PROJECTS */}
          {activeTab === 'projects' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Portfolio Projects</h3>
                <button onClick={addProject} className="btn btn-secondary btn-sm">
                  <Plus size={16} /> Add Project
                </button>
              </div>

              {(profile.projects || []).map((proj, index) => (
                <div key={proj.id || index} style={{
                  padding: '20px',
                  background: 'rgba(15, 23, 42, 0.4)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--accent-primary)' }}>Project #{index + 1}</h4>
                    <button onClick={() => removeProject(index)} className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label className="form-label">Project Title</label>
                      <input
                        type="text"
                        className="input-field"
                        value={proj.title}
                        onChange={(e) => handleProjChange(index, 'title', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label">Live Link / GitHub Repo</label>
                      <input
                        type="text"
                        className="input-field"
                        value={proj.link}
                        onChange={(e) => handleProjChange(index, 'link', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Description</label>
                    <textarea
                      className="input-field"
                      rows={2}
                      value={proj.description}
                      onChange={(e) => handleProjChange(index, 'description', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
