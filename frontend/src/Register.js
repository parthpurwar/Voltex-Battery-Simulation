import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Attempting to register:', { username, email, password: '***' });
      
      const endpoint = 'http://localhost:8000/api/register/';
      console.log('Trying endpoint:', endpoint);
      
      const response = await axios.post(endpoint, 
        { username, email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        }
      );
      
      console.log('Registration successful:', response.data);
      alert("Registration successful. Please login.");
      navigate('/login');
      
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Make sure the backend is running on http://localhost:8000');
      } else if (error.code === 'ECONNABORTED') {
        setError('Request timeout. Server took too long to respond.');
      } else if (error.response) {
        // Server responded with error
        console.log('Error response:', error.response);
        setError(error.response.data?.error || error.response.data?.message || `Server error: ${error.response.status}`);
      } else if (error.request) {
        // Request made but no response
        setError('No response from server. Check if backend is running.');
      } else {
        // Something else happened
        setError(`Network error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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

            {/* Register Card */}
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
                    Create Account
                  </h2>
                  <p className="text-muted mb-0">Join BattSim to start your simulation journey</p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="alert alert-danger" style={{
                    borderRadius: '15px',
                    border: 'none',
                    backgroundColor: '#f8d7da',
                    color: '#721c24'
                  }}>
                    <strong>⚠️ Error:</strong> {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleRegister}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: '#2c3e50' }}>
                      Username
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
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="Choose a username"
                      onFocus={(e) => e.target.style.borderColor = '#20c997'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: '#2c3e50' }}>
                      Email Address
                    </label>
                    <input 
                      type="email" 
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

                  <div className="mb-3">
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
                      placeholder="Create a strong password"
                      onFocus={(e) => e.target.style.borderColor = '#20c997'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                    <div className="form-text text-muted small">
                      Password must be at least 6 characters long
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ color: '#2c3e50' }}>
                      Confirm Password
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
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="Confirm your password"
                      onFocus={(e) => e.target.style.borderColor = '#20c997'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                  </div>

                  {/* Terms & Conditions */}
                  <div className="form-check mb-4">
                    <input className="form-check-input" type="checkbox" id="agreeTerms" required />
                    <label className="form-check-label text-muted" htmlFor="agreeTerms">
                      I agree to the{' '}
                      <a href="#" className="text-decoration-none" style={{ color: '#20c997' }}>
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-decoration-none" style={{ color: '#20c997' }}>
                        Privacy Policy
                      </a>
                    </label>
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
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
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

                {/* Social Registration Options */}
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
                    Sign up with SSO
                  </button>
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <button
                      onClick={() => navigate('/login')}
                      className="btn btn-link p-0 fw-bold text-decoration-none"
                      style={{ color: '#20c997' }}
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Text */}
            <div className="text-center mt-4">
              <p className="text-white-50 small mb-0">
                © 2025 BattSim. Your data is protected with enterprise-grade security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}