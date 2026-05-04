import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle, Zap, Shield } from 'lucide-react';

function Home() {
  return (
    <div className="animate-slide-up">
      {/* Hero Section */}
      <div className="container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#eef2ff', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '99px', fontSize: '0.875rem', fontWeight: '600', marginBottom: '1.5rem' }}>
          <Sparkles size={16} />
          <span>New: AI-Powered Keyword Analysis</span>
        </div>
        
        <h1 style={{ fontSize: '4rem', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--slate-900)' }}>
          Landing your dream job <br /> 
          <span style={{ color: 'var(--primary)' }}>starts with your resume.</span>
        </h1>
        
        <p style={{ fontSize: '1.25rem', color: 'var(--slate-700)', maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
          Scan your resume against job descriptions to identify missing keywords, 
          formatting issues, and section gaps in seconds.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/analyze" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Get Started Free <ArrowRight size={20} />
          </Link>
          <a href="#features" className="btn" style={{ padding: '1rem 2rem', background: 'white', border: '1px solid var(--slate-200)', color: 'var(--slate-700)' }}>
            Learn More
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" style={{ background: 'white', padding: '5rem 0', borderTop: '1px solid var(--slate-100)' }}>
        <div className="container">
          <div className="dashboard-grid">
            <div className="card" style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: '1rem' }}>
              <div style={{ background: '#dcfce7', color: '#166534', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <CheckCircle size={24} />
              </div>
              <h3>Keyword Optimization</h3>
              <p style={{ color: 'var(--slate-700)' }}>Find exactly which industry terms you're missing to pass automated ATS filters.</p>
            </div>

            <div className="card" style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: '1rem' }}>
              <div style={{ background: '#fef3c7', color: '#92400e', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Zap size={24} />
              </div>
              <h3>Instant Scoring</h3>
              <p style={{ color: 'var(--slate-700)' }}>Receive a detailed score out of 100 based on formatting, sections, and relevance.</p>
            </div>

            <div className="card" style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: '1rem' }}>
              <div style={{ background: '#e0f2fe', color: '#075985', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Shield size={24} />
              </div>
              <h3>Privacy Guaranteed</h3>
              <p style={{ color: 'var(--slate-700)' }}>Your data is processed instantly and never stored on our servers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
