import React, { useEffect, useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { 
  CheckCircle2, AlertCircle, BarChart3, 
  Printer, RefreshCcw, Star, ThumbsUp, 
  Target, Zap, Briefcase, ListTodo, ShieldAlert,
  Award, MessageSquare, ChevronRight
} from 'lucide-react';

function Results() {
  const location = useLocation();
  const results = location.state?.results;
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (results?.ats_score) {
      const timer = setTimeout(() => setAnimatedScore(results.ats_score), 500);
      return () => clearTimeout(timer);
    }
  }, [results]);

  if (!results) return <Navigate to="/analyze" />;

  const { 
    ats_score, keyword_score, section_score, format_score,
    verb_strength, seniority, job_title, fetched_online, interview_questions,
    matched_keywords, missing_keywords, all_jd_keywords,
    matched_skills, missing_skills, all_jd_skills, industry_standard_skills,
    density_data, found_sections, missing_sections, issues, ats_friendly
  } = results;

  const getPerformanceFeedback = () => {
    if (ats_score >= 75) return { text: "Great job! Your resume is well aligned with the job.", icon: <Star color="#10b981" />, color: "#10b981" };
    if (ats_score >= 40) return { text: "Good effort! Improve missing skills to increase chances.", icon: <ThumbsUp color="#f59e0b" />, color: "#f59e0b" };
    return { text: "Needs improvement. Focus on adding key skills and experience.", icon: <AlertCircle color="#ef4444" />, color: "#ef4444" };
  };

  const feedback = getPerformanceFeedback();

  return (
    <div className="container animate-slide-up" id="report-content">
      
      {/* SaaS Dashboard Header */}
      <header className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>Analysis Report</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <p style={{ color: 'var(--slate-700)', margin: 0 }}>Job Role: <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{job_title || 'Software Professional'}</span></p>
            {fetched_online && (
              <span style={{ fontSize: '0.65rem', padding: '2px 8px', background: '#dcfce7', color: '#166534', borderRadius: '100px', fontWeight: '800', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%' }}></span> LIVE ONLINE RETRIEVAL
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => window.print()} className="btn" style={{ background: 'white', border: '1px solid var(--slate-200)', color: 'var(--slate-700)' }}>
            <Printer size={18} /> Print Report
          </button>
          <Link to="/analyze" className="btn btn-primary">
            <RefreshCcw size={18} /> New Analysis
          </Link>
        </div>
      </header>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        
        {/* Card 1: ATS Score & Seniority Fit */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>ATS Match Score</h3>
            <div className="score-circle-container" style={{ width: '120px', height: '120px' }}>
              <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="50" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
                <circle cx="60" cy="60" r="50" fill="transparent" stroke={feedback.color} strokeWidth="8" strokeDasharray={314} strokeDashoffset={314 - (animatedScore / 100) * 314} style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
              </svg>
              <div className="score-text">
                <span className="score-value" style={{ fontSize: '1.5rem' }}>{animatedScore}%</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, padding: '1rem', background: '#f8fafc', borderRadius: '12px', textAlign: 'center' }}>
              <Award size={20} color="var(--primary)" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#666' }}>SENIORITY FIT</div>
              <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{seniority}</div>
            </div>
            <div style={{ flex: 1, padding: '1rem', background: '#f8fafc', borderRadius: '12px', textAlign: 'center' }}>
              <Zap size={20} color="var(--warning)" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#666' }}>VERB STRENGTH</div>
              <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{verb_strength}%</div>
            </div>
          </div>
        </div>

        {/* Card 2: Performance Feedback */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', background: `${feedback.color}05`, border: `1px solid ${feedback.color}20` }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '1rem' }}>
              {feedback.icon}
              <h2 style={{ margin: 0, color: feedback.color, fontSize: '1.5rem', fontWeight: '800' }}>Analysis Result</h2>
            </div>
            <p style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--slate-800)', margin: '0 0 1rem' }}>{feedback.text}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
               <span className={`tag ${ats_friendly === 'Yes' ? 'tag-success' : 'tag-danger'}`}>ATS Friendly: {ats_friendly}</span>
            </div>
          </div>
        </div>
      </div>

      {/* NEW SECTION: Required Skills vs Gap Analysis */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Briefcase size={22} color="var(--primary)" /> Smart Skill Dashboard
        </h3>
        
        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--slate-700)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Consolidated Requirements ({all_jd_skills?.length || 0})</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {all_jd_skills?.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: '#eef2ff', color: '#4338ca', border: '1px solid #e0e7ff', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600' }}>
                  {matched_skills.includes(s) ? <CheckCircle2 size={14} color="#10b981" /> : <ShieldAlert size={14} color="#ef4444" />}
                  {s}
                  {industry_standard_skills?.includes(s) && <span style={{ fontSize: '0.6rem', color: '#6366f1', marginLeft: '4px' }}>★</span>}
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '1rem' }}><span style={{ color: '#6366f1' }}>★</span> Synced from Online Job Profile Repositories</p>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--slate-700)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Missing for Role Fit</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {missing_skills?.length > 0 ? missing_skills.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px' }}>
                  <span style={{ color: '#be123c', fontWeight: '700', fontSize: '0.9rem' }}>{s}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', background: industry_standard_skills?.includes(s) ? '#6366f1' : '#be123c', color: 'white', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    {industry_standard_skills?.includes(s) ? 'Online Profile Sync' : 'Job Specific'}
                  </span>
                </div>
              )) : (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#666', background: '#f8fafc', borderRadius: '8px' }}>
                  All key skills matched!
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontWeight: '700' }}>Overall Skill Match (JD + Industry Standard)</span>
            <span style={{ fontWeight: '800' }}>{matched_skills?.length || 0} / {all_jd_skills?.length || 0} Matched</span>
          </div>
          <div className="progress-thin-container" style={{ margin: 0, height: '10px' }}>
            <div className="progress-thin-bar" style={{ width: `${(matched_skills?.length / all_jd_skills?.length) * 100 || 0}%`, backgroundColor: 'var(--primary)' }}></div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
        {/* Interview Prep Section */}
        <div className="card">
          <h3 style={{ margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={20} color="var(--primary)" /> Interview Prep Guide
          </h3>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>Practice these questions based on the job requirements:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {interview_questions.map((q, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '1rem', background: 'var(--slate-50)', borderRadius: '10px', borderLeft: '4px solid var(--primary)' }}>
                <span style={{ fontWeight: '800', color: 'var(--primary)' }}>Q{i+1}</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{q}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap & Formatting */}
        <div className="card">
          <h3 style={{ margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ListTodo size={20} color="var(--primary)" /> Content Strategy
          </h3>
          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#666', textTransform: 'uppercase' }}>Critical Fixes</h5>
            {issues.map((issue, i) => (
              <div key={i} className="suggestion-item" style={{ margin: '0 0 8px', borderColor: 'var(--danger)' }}>
                 <AlertCircle size={14} color="var(--danger)" /> {issue}
              </div>
            ))}
          </div>
          <div>
            <h5 style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#666', textTransform: 'uppercase' }}>Action Items</h5>
            {missing_sections.map((sec, i) => (
              <div key={i} className="suggestion-item" style={{ margin: '0 0 8px' }}>
                 <ChevronRight size={14} color="var(--primary)" /> Add "{sec}" section
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="no-print" style={{ textAlign: 'center', margin: '4rem 0' }}>
        <Link to="/analyze">
          <button style={{ backgroundColor: '#1e293b', padding: '1rem 3rem' }} className="btn btn-primary">Try New Analysis</button>
        </Link>
      </div>
    </div>
  );
}

export default Results;
