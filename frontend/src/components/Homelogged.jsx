import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BatteryDashboard() {
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Welcome to BattSim! How can I help you with battery analysis today?", sender: "bot" },
    { id: 2, text: "I'd like to analyze battery performance data", sender: "user" },
    { id: 3, text: "Great! I can help you with battery capacity analysis, discharge curves, and performance optimization.", sender: "bot" }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate= useNavigate();

  const handleNavigation = (route) => {
    console.log(`Navigating to: ${route}`);
    // Navigation logic would be implemented here
  };
  const handlelogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    navigate('/Login');
  }
  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, { 
        id: Date.now(), 
        text: newMessage, 
        sender: "user" 
      }]);
      setNewMessage('');
      
      // Simulate bot response
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: "I'm analyzing your request. Our battery simulation models can provide detailed insights on this topic.",
          sender: "bot"
        }]);
      }, 1000);
    }
  };

  // Mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #0e4166 100%)',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"Inter", "Segoe UI", sans-serif'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}>
        
       

        <div style={{
          position: 'absolute',
          top: '15%',
          left: '8%',
          fontSize: '5rem',
          opacity: 0.25,
          color: '#00ffaa',
          transform: `translate(${mousePosition.x * -0.5}px, ${mousePosition.y * -0.5}px) rotate(${mousePosition.x * 0.5}deg)`,
          transition: 'transform 0.3s ease-out',
          animation: 'energyPulse 5s ease-in-out infinite',
          filter: 'drop-shadow(0 0 20px rgba(0, 255, 170, 0.3))'
        }}>
          ⚡
        </div>

        <div style={{
          position: 'absolute',
          bottom: '25%',
          right: '12%',
          fontSize: '5rem',
          opacity: 0.25,
          color: '#00c8ff',
          transform: `translate(${mousePosition.x * 1.0}px, ${mousePosition.y * 1.0}px) rotate(${mousePosition.x * 0.5}deg)`,
          transition: 'transform 0.4s ease-out',
          animation: 'energyPulse 7s ease-in-out infinite reverse',
          filter: 'drop-shadow(0 0 15px rgba(0, 200, 255, 0.3))'
        }}>
          🔋
        </div>

       
      </div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg" style={{ 
        padding: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.01)',
        backdropFilter: 'blur(15px)',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="container-fluid" style={{ margin: '0 10px' }}>
          <a className="navbar-brand fw-bold d-flex align-items-center" href="#" style={{ color: 'white' }}>
            <span style={{ fontSize: '2rem', marginRight: '10px' }}>⚡</span>
            Voltex
          </a>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link text-white fw-medium" href="#">Dashboard</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="/simulate">Simulations</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#">Analytics</a>
              </li>
            </ul>
            
            <div className="d-flex gap-2">
              <button 
                onClick={handlelogout}
                className="btn btn-outline-light"
                style={{
                  borderRadius: '25px',
                  padding: '8px 20px',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                Logout
              </button>
              
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid" style={{ padding: '0 20px', position: 'relative', zIndex: 5 }}>
        {/* Hero Section */}
        <div className="row justify-content-center text-center py-5">
          <div className="col-lg-8">
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.01)',
              backdropFilter: 'blur(15px)',
              borderRadius: '30px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transform: `perspective(1000px) rotateX(${mousePosition.y * 0.02}deg) rotateY(${mousePosition.x * 0.02}deg)`,
              transition: 'transform 0.1s ease-out'
            }}>
              <h1 className="display-4 fw-bold text-white mb-4">
                Advanced Battery Simulation Platform
              </h1>
              <p className="lead text-white mb-4">
                Harness the power of AI-driven analytics to optimize battery performance and enhance energy efficiency.
              </p>
              <div className="d-flex justify-content-center gap-4 flex-wrap">
                <div className="text-center">
                  <div className="h2 fw-bold text-white">🔋</div>
                  <div className="text-white small">Battery Analysis</div>
                </div>
                <div className="text-center">
                  <div className="h2 fw-bold text-white">⚡</div>
                  <div className="text-white small">Performance</div>
                </div>
                <div className="text-center">
                  <div className="h2 fw-bold text-white">📊</div>
                  <div className="text-white small">Insights</div>
                </div>
                <div className="text-center">
                  <div className="h2 fw-bold text-white">🤖</div>
                  <div className="text-white small">AI-Powered</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="row justify-content-center py-5">
          <div className="col-12">
            <div className="row align-items-center" style={{ minHeight: '500px' }}>
              
              {/* Chatbot Section - Left Half */}
              <div className="col-md-6">
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '25px',
                  padding: '30px',
                  height: '500px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                  transform: `perspective(1000px) rotateY(${mousePosition.x * 0.03}deg) rotateX(${mousePosition.y * -0.02}deg)`,
                  transition: 'transform 0.2s ease-out'
                }}>
                  {/* Chat Header */}
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                      <div style={{ 
                        fontSize: '1.5rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #20c997 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginRight: '10px'
                      }}>
                        🤖
                      </div>
                      <h4 className="fw-bold mb-0" style={{ color: '#2c3e50' }}>
                        BattSim Assistant
                      </h4>
                    </div>
                    <button 
                      onClick={() => navigate('/chatbot')}
                      className="btn btn-sm"
                      style={{
                        onClick: () => navigate('/chatbot'),
                        background: 'linear-gradient(135deg, #667eea 0%, #20c997 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '15px',
                        padding: '5px 15px'
                      }}
                    >
                      Open Full Chat
                    </button>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="flex-grow-1 overflow-auto mb-3" style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '15px',
                    padding: '15px',
                    maxHeight: '320px'
                  }}>
                    {chatMessages.slice(-3).map((message) => (
                      <div key={message.id} className={`mb-3 ${message.sender === 'user' ? 'text-end' : ''}`}>
                        <div 
                          className="d-inline-block px-3 py-2"
                          style={{
                            backgroundColor: message.sender === 'user' ? '#667eea' : '#e9ecef',
                            color: message.sender === 'user' ? 'white' : '#2c3e50',
                            borderRadius: message.sender === 'user' ? '15px 15px 5px 15px' : '15px 15px 15px 5px',
                            maxWidth: '80%'
                          }}
                        >
                          {message.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Chat Input */}
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ask about battery performance..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage(e);
                        }
                      }}
                      style={{
                        borderRadius: '25px',
                        border: '2px solid #e9ecef',
                        padding: '10px 15px'
                      }}
                    />
                    <button 
                      type="button"
                      onClick={handleSendMessage}
                      className="btn"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #20c997 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '45px',
                        height: '45px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      📤
                    </button>
                  </div>
                </div>
              </div>

              {/* Service Section - Right Half */}
              <div className="col-md-6">
                <div 
                  className="h-100 d-flex flex-column justify-content-center p-4"
                  style={{
                    background: 'rgba(255,255, 255, 0.01)',
                    borderRadius: '25px',
                    minHeight: '500px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                    transform: `perspective(1000px) rotateY(${mousePosition.x * -0.03}deg) rotateX(${mousePosition.y * 0.02}deg)`,
                  }}
                  onClick={() => handleNavigation('/services')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = `perspective(1000px) rotateY(${mousePosition.x * -0.03}deg) rotateX(${mousePosition.y * 0.02}deg) scale(1.02) translateY(-10px)`;
                    e.currentTarget.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = `perspective(1000px) rotateY(${mousePosition.x * -0.03}deg) rotateX(${mousePosition.y * 0.02}deg) scale(1) translateY(0)`;
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
                  }}
                >
                  <div className="text-center text-white">
                    <div style={{ fontSize: '5rem', marginBottom: '30px' }}>
                      ⚡
                    </div>
                    <h2 className="fw-bold mb-4">Battery Services</h2>
                    <p className="lead mb-4" style={{ opacity: 0.9 }}>
                      Comprehensive battery analysis, performance optimization, and predictive modeling services
                    </p>
                    <button 
                    onClick={()=> navigate('/simulate')}
                      className="btn btn-light btn-lg fw-bold"
                      style={{
                        borderRadius: '25px',
                        padding: '12px 30px',
                        color: '#2c3e50',
                        border: 'none',
                        boxShadow: '0 5px 15px rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      Explore Services →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
       <footer className="mt-5 py-5" style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <h5 className="fw-bold mb-3" style={{ color: '#20c997' }}>
                ⚡ Voltex
              </h5>
              <p className="text-light">
                Advanced battery simulation platform for research, education, and development.
              </p>
              <div className="d-flex gap-3 mt-3">
                <a href="#" className="text-white" style={{ fontSize: '1.5rem' }}>📧</a>
                <a href="#" className="text-white" style={{ fontSize: '1.5rem' }}>🐦</a>
                <a href="#" className="text-white" style={{ fontSize: '1.5rem' }}>💼</a>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h6 className="fw-bold mb-3 text-white">Product</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-light text-decoration-none">Features</a></li>
                <li><a href="#" className="text-light text-decoration-none">Pricing</a></li>
                <li><a href="#" className="text-light text-decoration-none">Documentation</a></li>
                <li><a href="#" className="text-light text-decoration-none">API</a></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h6 className="fw-bold mb-3 text-white">Company</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-light text-decoration-none">About</a></li>
                <li><a href="#" className="text-light text-decoration-none">Blog</a></li>
                <li><a href="#" className="text-light text-decoration-none">Careers</a></li>
                <li><a href="#" className="text-light text-decoration-none">Contact</a></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h6 className="fw-bold mb-3 text-white">Resources</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-light text-decoration-none">Help Center</a></li>
                <li><a href="#" className="text-light text-decoration-none">Tutorials</a></li>
                <li><a href="#" className="text-light text-decoration-none">Community</a></li>
                <li><a href="#" className="text-light text-decoration-none">Support</a></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h6 className="fw-bold mb-3 text-white">Legal</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-light text-decoration-none">Privacy</a></li>
                <li><a href="#" className="text-light text-decoration-none">Terms</a></li>
                <li><a href="#" className="text-light text-decoration-none">Security</a></li>
                <li><a href="#" className="text-light text-decoration-none">Cookies</a></li>
              </ul>
            </div>
          </div>
          <hr className="my-4" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="text-light mb-0">© 2025 ⚡Voltex. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="text-light mb-0">Made with ❤️ for battery innovation</p>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}