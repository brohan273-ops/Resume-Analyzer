import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

function Analyze() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jobRole, setJobRole] = useState(''); // New state for Job Role
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume || !jobDescription) {
      setError('Please upload a resume and paste the job description.');
      return;
    }

    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('job_description', jobDescription);
    formData.append('job_role', jobRole); // Pass user-selected role

    console.log(`[DEBUG] Submitting Analysis - Role: ${jobRole}`);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/analyze/', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`
        },
      });
      console.log(`[DEBUG] API Success - Received Role: ${response.data.job_title}`);
      navigate('/results', { state: { results: response.data } });
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.response?.data?.error || 'Analysis failed. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-slide-up" style={{ maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Analyze Your Match
        </h1>
        <p style={{ color: 'var(--slate-700)', fontSize: '1.1rem' }}>
          Compare your resume with any job description in seconds.
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>1. Target Job Role (Optional)</label>
            <input 
              type="text"
              placeholder="e.g. Frontend Developer, Cyber Security Analyst"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              style={{ marginBottom: '1.5rem', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
            />
          </div>

          <div className="form-group">
            <label>2. Upload Resume</label>
            <div 
              className="file-upload-zone"
              onClick={() => fileInputRef.current.click()}
              style={resume ? { borderColor: 'var(--success)', background: '#f0fdf4' } : {}}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx"
                style={{ display: 'none' }}
              />
              {resume ? (
                <div>
                  <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
                  <p style={{ fontWeight: '600', color: 'var(--success)' }}>{resume.name}</p>
                  <p style={{ fontSize: '0.85rem', color: '#666' }}>Click to change file</p>
                </div>
              ) : (
                <div>
                  <Upload size={48} color="var(--primary)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <p style={{ fontWeight: '600' }}>Drop your resume here or click to browse</p>
                  <p style={{ fontSize: '0.85rem', color: '#666' }}>Supports PDF and DOCX (Max 5MB)</p>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>3. Job Description</label>
            <textarea 
              placeholder="Paste the target job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              style={{ minHeight: '200px' }}
            />
          </div>

          {error && (
            <div style={{ padding: '1rem', background: '#fef2f2', color: 'var(--danger)', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #fee2e2', fontSize: '0.9rem', display: 'flex', gap: '0.5rem' }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="loader" size={20} />
                Processing your career...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Analyze Match
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
}

export default Analyze;
