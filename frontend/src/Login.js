// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/token/', {
        username: email,
        password: password,
      });
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      localStorage.setItem('username', email);
      
      navigate('/Homelogged');
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Invalid credentials. Please check your username and password.');
      } else if (err.response?.status === 400) {
        alert('Bad request. Please check your input.');
      } else if (err.response?.status >= 500) {
        alert('Server error. Please try again later.');
      } else {
        alert('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #0e4166 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: '20px 0'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7 col-sm-9">
            {/* Back to Home Button */}
            <div className="mb-4">
              <button 
                onClick={() => navigate('/')}
                className="btn d-flex align-items-center"
                style={{
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '25px',
                  padding: '8px 16px'
                }}
              >
                ← Back to Home
              </button>
            </div>

            {/* Login Card */}
            <div className="card border-0 shadow-lg" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(15px)',
              borderRadius: '20px'
            }}>
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <span style={{ 
                      fontSize: '3rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #20c997 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      ⚡
                    </span>
                  </div>
                  <h2 className="fw-bold mb-2" style={{ 
                    color: '#2c3e50',
                    fontSize: '2rem'
                  }}>
                    Welcome Back
                  </h2>
                  <p className="text-muted mb-0">Sign in to continue to BattSim</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ color: '#2c3e50' }}>
                      Username/Email
                    </label>
                    <input 
                      type="text" 
                      className="form-control form-control-lg"
                      style={{
                        borderRadius: '15px',
                        border: '2px solid #e9ecef',
                        padding: '12px 20px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                      value={email} 
                      onChange={e => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="Enter your email"
                      onFocus={(e) => e.target.style.borderColor = '#20c997'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ color: '#2c3e50' }}>
                      Password
                    </label>
                    <input 
                      type="password" 
                      className="form-control form-control-lg"
                      style={{
                        borderRadius: '15px',
                        border: '2px solid #e9ecef',
                        padding: '12px 20px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                      value={password} 
                      onChange={e => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="Enter your password"
                      onFocus={(e) => e.target.style.borderColor = '#20c997'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="rememberMe" />
                      <label className="form-check-label text-muted" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <a href="/forgotpassword" className="text-decoration-none" style={{ color: '#20c997' }}>
                      Forgot password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid mb-4">
                    <button 
                      type="submit" 
                      className="btn btn-lg fw-bold"
                      style={{
                        background: loading ? '#6c757d' : 'linear-gradient(135deg, #667eea 0%, #20c997 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '15px',
                        padding: '12px',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease',
                        boxShadow: loading ? 'none' : '0 4px 15px rgba(32, 201, 151, 0.3)'
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <div className="text-center mb-4">
                  <div className="d-flex align-items-center">
                    <hr className="flex-grow-1" />
                    <span className="px-3 text-muted small">OR</span>
                    <hr className="flex-grow-1" />
                  </div>
                </div>

                {/* Social Login Options */}
                <div className="d-grid gap-2 mb-4">
                  <button 
                    type="button"
                    className="btn btn-outline-secondary btn-lg"
                    style={{
                      borderRadius: '15px',
                      border: '2px solid #e9ecef',
                      color: '#2c3e50'
                    }}
                  >
                    <span className="me-2">🔐</span>
                    Continue with SSO
                  </button>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <p className="text-muted mb-0">
                    Don't have an account?{' '}
                    <button
                      onClick={() => navigate('/register')}
                      className="btn btn-link p-0 fw-bold text-decoration-none"
                      style={{ color: '#20c997' }}
                    >
                      Create one here
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Text */}
            <div className="text-center mt-4">
              <p className="text-white-50 small mb-0">
                © 2025 BattSim. Secure authentication powered by advanced encryption.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}