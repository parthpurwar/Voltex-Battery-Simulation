import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function ForgotPassword() {

      const [email, setEmail] = useState('');
      const [loading, setLoading] = useState(false);
      const navigate = useNavigate();

      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response =await axios.post('http://localhost:8000/api/request-password-reset-otp/',{
                username: email
            })
            if(response.status==200){
                navigate('/login');
            }
            else{
                alert('test check');
            }
        }
        catch (error) {
            console.error('Error requesting password reset:', error);
            alert('Failed to request password reset. Please try again.');
        } finally {
            setLoading(false);
        }
      }
      return(
        <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7 col-sm-9">
            {/* Back to Home Button */}
            <div className="mb-4">
              <button 
                onClick={() => navigate('/login')}
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
                          Sending OTP to email...
                        </>
                      ) : (
                        'Request OTP'
                      )}
                    </button>
                  </div>
                </form>               
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
      );
    
}