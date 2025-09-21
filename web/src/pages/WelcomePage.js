import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    // Simulate login process
    localStorage.setItem('userLoggedIn', 'true');
    navigate('/home');
  };

  return (
    <div className="welcome-container">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="bg-animation"></div>
        <div className="bg-animation"></div>
        <div className="bg-animation"></div>
      </div>

      {/* Header */}
      <header className="welcome-header">
        <div className="brand-container">
          <div className="brand-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="12" fill="url(#welcomeGradient)"/>
              <path d="M12 20c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8z" fill="white"/>
              <path d="M20 16v8M16 20h8" stroke="#667eea" strokeWidth="2" strokeLinecap="round"/>
              <defs>
                <linearGradient id="welcomeGradient" x1="0" y1="0" x2="40" y2="40">
                  <stop stopColor="#667eea"/>
                  <stop offset="1" stopColor="#764ba2"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="brand-name">SOS Car Repair</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="welcome-main">
        <div className="content-container">
          <div className="hero-section">
            <h1 className="hero-title">
              Professional Car Service
              <span className="title-highlight">At Your Fingertips</span>
            </h1>
            
            <p className="hero-description">
              Connect instantly with verified mechanics nationwide. 24/7 emergency support, 
              real-time tracking, and professional automotive care delivered with excellence.
            </p>

            <div className="feature-highlights">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 22h20L12 2z" fill="currentColor"/>
                  </svg>
                </div>
                <span>Emergency SOS</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                    <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <span>Real-time Tracking</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Verified Mechanics</span>
              </div>
            </div>

            <div className="cta-section">
              <button onClick={handleSignIn} className="signin-button">
                <span className="button-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7 3L17 10L7 17V3Z" fill="currentColor"/>
                  </svg>
                </span>
                Sign In to Platform
              </button>
              
              <div className="auth-options">
                <div className="divider">
                  <span>or continue with</span>
                </div>
                <div className="social-buttons">
                  <button className="social-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </button>
                  <button className="social-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                    </svg>
                    Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="welcome-stats">
            <div className="stat-card">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">5K+</div>
              <div className="stat-label">Verified Mechanics</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Emergency Support</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .welcome-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          position: relative;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .animated-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }

        .bg-animation {
          position: absolute;
          width: 200px;
          height: 200px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          animation: float 15s infinite linear;
        }

        .bg-animation:nth-child(1) {
          top: -50px;
          left: -50px;
          animation-delay: 0s;
        }

        .bg-animation:nth-child(2) {
          top: 50%;
          right: -100px;
          animation-delay: -5s;
        }

        .bg-animation:nth-child(3) {
          bottom: -50px;
          left: 30%;
          animation-delay: -10s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-100px) rotate(180deg);
            opacity: 0.1;
          }
        }

        .welcome-header {
          position: relative;
          z-index: 10;
          padding: 30px 50px;
        }

        .brand-container {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .brand-icon {
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
        }

        .brand-name {
          font-size: 1.8rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .welcome-main {
          position: relative;
          z-index: 10;
          padding: 50px;
        }

        .content-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          gap: 60px;
        }

        .hero-section {
          text-align: center;
          color: white;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          margin: 0 0 30px 0;
          line-height: 1.2;
          text-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .title-highlight {
          display: block;
          background: rgba(255,255,255,0.2);
          margin: 20px auto 0;
          padding: 10px 30px;
          border-radius: 50px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.3);
          max-width: fit-content;
          font-size: 3.5rem;
        }

        .hero-description {
          font-size: 1.3rem;
          opacity: 0.95;
          line-height: 1.6;
          max-width: 700px;
          margin: 0 auto 50px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .feature-highlights {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin: 60px 0;
          flex-wrap: wrap;
        }

        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          background: rgba(255,255,255,0.15);
          padding: 30px 25px;
          border-radius: 20px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.3s ease;
          min-width: 160px;
        }

        .feature-item:hover {
          transform: translateY(-10px);
          background: rgba(255,255,255,0.2);
        }

        .feature-icon {
          width: 50px;
          height: 50px;
          background: rgba(255,255,255,0.2);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .feature-item span {
          font-weight: 600;
          font-size: 1rem;
        }

        .cta-section {
          margin-top: 60px;
        }

        .signin-button {
          background: linear-gradient(135deg, #ff6b6b, #ee5a52);
          color: white;
          border: none;
          padding: 20px 40px;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 0 auto 40px;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
          min-width: 240px;
        }

        .signin-button:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(255, 107, 107, 0.4);
        }

        .button-icon {
          width: 20px;
          height: 20px;
        }

        .auth-options {
          max-width: 400px;
          margin: 0 auto;
        }

        .divider {
          position: relative;
          text-align: center;
          margin: 30px 0;
          color: rgba(255,255,255,0.8);
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(255,255,255,0.3);
          z-index: 1;
        }

        .divider span {
          background: linear-gradient(135deg, #667eea, #764ba2);
          padding: 0 20px;
          position: relative;
          z-index: 2;
          font-size: 0.9rem;
        }

        .social-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .social-btn {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          padding: 15px 25px;
          border-radius: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 500;
          transition: all 0.3s ease;
          flex: 1;
          justify-content: center;
        }

        .social-btn:hover {
          background: rgba(255,255,255,0.25);
          transform: translateY(-2px);
        }

        .welcome-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
          margin-top: 40px;
        }

        .stat-card {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          padding: 30px 20px;
          border-radius: 20px;
          text-align: center;
          color: white;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.2);
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 10px;
          display: block;
        }

        .stat-label {
          font-size: 0.95rem;
          opacity: 0.9;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .title-highlight {
            font-size: 2.2rem;
          }

          .feature-highlights {
            flex-direction: column;
            align-items: center;
          }

          .welcome-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .welcome-header,
          .welcome-main {
            padding: 30px 20px;
          }
        }

        @media (max-width: 480px) {
          .welcome-stats {
            grid-template-columns: 1fr;
          }

          .social-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default WelcomePage;
