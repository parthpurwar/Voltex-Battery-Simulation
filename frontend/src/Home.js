// Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #0e4166 100%)',
      minHeight: '100vh',
      color: '#ffffff'
    }}>
            <div className="container pt-3">
      <nav class="navbar navbar-expand-lg navbar-light sticky-top rounded-3 shadow-lg"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
        <div class="container-fluid">
          <a class="navbar-brand fw-bold text-white" href="/" style={{ fontSize: '1.5rem' }}>
          ⚡Voltex
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
         </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
      
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
               <a class="nav-link active text-white" aria-current="page" href="#">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link text-white" href="#">About Us</a>
              </li>
              <li class="nav-item">
               <a class="nav-link text-white" href="#">Blogs</a>
              </li>
            </ul>
      
      <div className="d-flex">
      <button 
        onClick={() => navigate('/login')}
        class="btn btn-outline-light me-2 fw-bold" 
        onMouseOver={(e)=>{ 
          e.target.style.backgroundColor = 'rgba(255,255,255)';
          e.target.style.color = '#20c997';
        }}
        onMouseLeave={(e)=>{
          e.target.style.backgroundColor = '#20c997';
          e.target.style.color = 'white';
        }}
         style={{ 
                    backgroundColor: '#20c997', 
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    padding: '8px 20px'
                  }}type="button">
              Login
      </button>
      <button 
                  onClick={() => navigate('/register')} 
                  className="btn fw-bold"
                  onMouseOver={(e)=>{ 
                e.target.style.backgroundColor = 'white';
                }}
                onMouseLeave={(e)=>{
                e.target.style.backgroundColor = 'transparent';
                }}
                  style={{ 
                    backgroundColor: 'transparent',
                    color: '#20c997',
                    border: '2px solid #20c997',
                    borderRadius: '25px',
                    padding: '6px 20px'
                  }}
                >
                  Register
      </button>    
      </div>
    </div>
  </div>
</nav>
</div>
            {/* Main Content */}
      <div className="container mt-5">
        <div className="row align-items-center min-vh-75">
          {/* Left Content */}
          <div className="col-lg-6 pe-lg-5">
            <h1 className="display-3 fw-bold mb-4" style={{ 
              color: '#ffffff',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              lineHeight: '1.2'
            }}>
              Welcome to 
              <span style={{ color: '#20c997' }}> Battery Simulator</span>
            </h1>
            <p className="lead mb-4" style={{ 
              fontSize: '1.3rem',
              color: '#e8f5e8',
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
            }}>
              Experience the future of battery technology with our advanced simulation platform. 
              Test, analyze, and optimize battery performance in real-time.
            </p>
            <p className="mb-4" style={{ 
              fontSize: '1.1rem',
              color: '#d1ecf1',
              lineHeight: '1.6'
            }}>
              Our cutting-edge simulator helps engineers, researchers, and students understand 
              battery behavior under various conditions. From lithium-ion to solid-state batteries, 
              explore the science behind energy storage.
            </p>
            <div className="d-flex gap-3 mt-4">
              <button 
                onClick={() => navigate('/register')}
                className="btn btn-lg fw-bold px-4"
                style={{ 
                  backgroundColor: '#20c997',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  boxShadow: '0 4px 15px rgba(32, 201, 151, 0.3)'
                }}
              >
                Get Started
              </button>
              <button 
                className="btn btn-lg fw-bold px-4"
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  border: '2px solid #ffffff',
                  borderRadius: '30px'
                }}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right Video */}
          <div className="col-lg-6 mt-5 mt-lg-0">
            <div className="position-relative">
              <div className="rounded-4 overflow-hidden shadow-lg" style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '20px'
              }}>
                <video 
                  className="w-100 rounded-3"
                  controls
                  poster="https://via.placeholder.com/600x400/20c997/ffffff?text=Battery+Simulation"
                  style={{ maxHeight: '400px' }}
                >
                  <source src="https://framerusercontent.com/assets/TZAzqgQVEts3NprJJni5pOep2B0.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="text-center mt-3">
                  <h5 className="text-white mb-2">Battery Simulation Demo</h5>
                  <p className="text-light small mb-0">Watch how our simulator works in action</p>
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

  );
}


