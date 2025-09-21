import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SOSFormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    registrationNumber: '',
    issue: '',
    issueDescription: '',
    urgencyLevel: 'high',
    location: '',
    contactNumber: '',
    preferredTime: 'immediate'
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const vehicleBrands = [
    'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 
    'Toyota', 'Kia', 'Volkswagen', 'Skoda', 'Nissan', 'Ford', 'BMW', 'Mercedes-Benz', 'Audi', 'Other'
  ];

  const commonIssues = [
    { id: 'engine', label: 'Engine Problems', icon: '🔧' },
    { id: 'battery', label: 'Battery Dead', icon: '🔋' },
    { id: 'tire', label: 'Flat Tire / Puncture', icon: '🛞' },
    { id: 'brake', label: 'Brake Issues', icon: '🛑' },
    { id: 'overheating', label: 'Engine Overheating', icon: '🌡️' },
    { id: 'electrical', label: 'Electrical Problems', icon: '⚡' },
    { id: 'transmission', label: 'Transmission Issues', icon: '⚙️' },
    { id: 'fuel', label: 'Fuel Problems', icon: '⛽' },
    { id: 'accident', label: 'Accident / Collision', icon: '🚗' },
    { id: 'other', label: 'Other Issues', icon: '🔍' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to confirmation/tracking page
      navigate('/sos-confirmation', { state: { formData } });
    } catch (error) {
      console.error('Error submitting SOS request:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleInputChange('location', `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get current location. Please enter manually.');
        }
      );
    }
  };

  return (
    <div className="sos-form-container">
      {/* Header */}
      <div className="sos-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="header-content">
          <div className="emergency-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 22h20L12 2z" fill="currentColor"/>
            </svg>
            Emergency SOS
          </div>
          <h1>Request Emergency Assistance</h1>
          <p>Fill out the details below and we'll dispatch help immediately</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="progress-container">
        <div className="progress-steps">
          {[1, 2, 3].map((step) => (
            <div key={step} className={`progress-step ${currentStep >= step ? 'active' : ''}`}>
              <div className="step-circle">
                {currentStep > step ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span className="step-label">
                {step === 1 ? 'Vehicle Info' : step === 2 ? 'Issue Details' : 'Location & Contact'}
              </span>
            </div>
          ))}
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form Content */}
      <div className="form-content">
        <div className="form-card">
          
          {/* Step 1: Vehicle Information */}
          {currentStep === 1 && (
            <div className="form-step">
              <h2>Vehicle Information</h2>
              <p className="step-description">Tell us about your vehicle to help us send the right mechanic</p>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Vehicle Brand *</label>
                  <select 
                    value={formData.vehicleBrand}
                    onChange={(e) => handleInputChange('vehicleBrand', e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select Brand</option>
                    {vehicleBrands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Vehicle Model *</label>
                  <input
                    type="text"
                    value={formData.vehicleModel}
                    onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                    placeholder="e.g., Swift, City, Creta"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Manufacturing Year</label>
                  <input
                    type="number"
                    value={formData.vehicleYear}
                    onChange={(e) => handleInputChange('vehicleYear', e.target.value)}
                    placeholder="e.g., 2020"
                    min="1990"
                    max={new Date().getFullYear()}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Registration Number</label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange('registrationNumber', e.target.value.toUpperCase())}
                    placeholder="e.g., KA01AB1234"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Issue Details */}
          {currentStep === 2 && (
            <div className="form-step">
              <h2>What's the Problem?</h2>
              <p className="step-description">Select the issue you're experiencing with your vehicle</p>
              
              <div className="issue-grid">
                {commonIssues.map(issue => (
                  <div 
                    key={issue.id}
                    className={`issue-card ${formData.issue === issue.id ? 'selected' : ''}`}
                    onClick={() => handleInputChange('issue', issue.id)}
                  >
                    <div className="issue-icon">{issue.icon}</div>
                    <div className="issue-label">{issue.label}</div>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Describe the Issue *</label>
                <textarea
                  value={formData.issueDescription}
                  onChange={(e) => handleInputChange('issueDescription', e.target.value)}
                  placeholder="Please provide more details about the problem..."
                  className="form-textarea"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Urgency Level</label>
                <div className="urgency-options">
                  {[
                    { value: 'critical', label: 'Critical - Road Blocked/Unsafe', color: '#ef4444' },
                    { value: 'high', label: 'High - Cannot Drive', color: '#f97316' },
                    { value: 'medium', label: 'Medium - Can Drive Slowly', color: '#eab308' },
                    { value: 'low', label: 'Low - Minor Issue', color: '#22c55e' }
                  ].map(option => (
                    <div 
                      key={option.value}
                      className={`urgency-option ${formData.urgencyLevel === option.value ? 'selected' : ''}`}
                      onClick={() => handleInputChange('urgencyLevel', option.value)}
                      style={{ borderColor: formData.urgencyLevel === option.value ? option.color : '#e2e8f0' }}
                    >
                      <div 
                        className="urgency-indicator" 
                        style={{ backgroundColor: option.color }}
                      ></div>
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location & Contact */}
          {currentStep === 3 && (
            <div className="form-step">
              <h2>Location & Contact Details</h2>
              <p className="step-description">Help us find you and get in touch</p>
              
              <div className="form-group">
                <label>Current Location *</label>
                <div className="location-input-group">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter your current location or landmark"
                    className="form-input"
                  />
                  <button 
                    type="button" 
                    className="location-button"
                    onClick={getCurrentLocation}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Use GPS
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Contact Number *</label>
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>When do you need assistance?</label>
                <div className="time-options">
                  {[
                    { value: 'immediate', label: 'Immediately', desc: 'Right now' },
                    { value: 'within-1hr', label: 'Within 1 hour', desc: 'Not urgent' },
                    { value: 'within-2hr', label: 'Within 2 hours', desc: 'Can wait' },
                    { value: 'scheduled', label: 'Schedule for later', desc: 'Specific time' }
                  ].map(option => (
                    <div 
                      key={option.value}
                      className={`time-option ${formData.preferredTime === option.value ? 'selected' : ''}`}
                      onClick={() => handleInputChange('preferredTime', option.value)}
                    >
                      <div className="time-content">
                        <div className="time-label">{option.label}</div>
                        <div className="time-desc">{option.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-navigation">
            {currentStep > 1 && (
              <button 
                className="nav-button secondary"
                onClick={handlePrevious}
              >
                Previous
              </button>
            )}
            
            {currentStep < 3 ? (
              <button 
                className="nav-button primary"
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && (!formData.vehicleBrand || !formData.vehicleModel)) ||
                  (currentStep === 2 && (!formData.issue || !formData.issueDescription))
                }
              >
                Next Step
              </button>
            ) : (
              <button 
                className="nav-button emergency"
                onClick={handleSubmit}
                disabled={loading || !formData.location || !formData.contactNumber}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Dispatching Help...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 22h20L12 2z" fill="currentColor"/>
                    </svg>
                    Send Emergency Request
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .sos-form-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #fef7f7 0%, #fef2f2 50%, #fff1f2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .sos-header {
          background: white;
          border-bottom: 1px solid #fecaca;
          padding: 20px 25px;
          display: flex;
          align-items: center;
          gap: 20px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .back-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 12px;
          border-radius: 12px;
          color: #374151;
          transition: all 0.2s;
        }

        .back-button:hover {
          background: #f9fafb;
          color: #111827;
        }

        .header-content {
          flex: 1;
        }

        .emergency-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .header-content h1 {
          margin: 0 0 8px 0;
          font-size: 1.75rem;
          font-weight: 700;
          color: #111827;
        }

        .header-content p {
          margin: 0;
          color: #6b7280;
          font-size: 1rem;
        }

        .progress-container {
          background: white;
          padding: 30px 25px;
          border-bottom: 1px solid #f3f4f6;
        }

        .progress-steps {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-bottom: 20px;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .step-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          transition: all 0.3s;
          border: 2px solid #e5e7eb;
          background: white;
          color: #9ca3af;
        }

        .progress-step.active .step-circle {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border-color: #ef4444;
          color: white;
        }

        .step-label {
          font-size: 0.85rem;
          font-weight: 500;
          color: #6b7280;
          text-align: center;
        }

        .progress-step.active .step-label {
          color: #374151;
        }

        .progress-bar {
          height: 4px;
          background: #f3f4f6;
          border-radius: 2px;
          overflow: hidden;
          max-width: 400px;
          margin: 0 auto;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          transition: width 0.3s ease;
        }

        .form-content {
          padding: 40px 25px;
          max-width: 800px;
          margin: 0 auto;
        }

        .form-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #f3f4f6;
        }

        .form-step h2 {
          margin: 0 0 10px 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
        }

        .step-description {
          margin: 0 0 30px 0;
          color: #6b7280;
          line-height: 1.5;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.2s;
          background: #fafafa;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #ef4444;
          background: white;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .issue-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }

        .issue-card {
          padding: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: #fafafa;
        }

        .issue-card:hover {
          border-color: #f87171;
          background: white;
        }

        .issue-card.selected {
          border-color: #ef4444;
          background: #fef2f2;
        }

        .issue-icon {
          font-size: 2rem;
          margin-bottom: 10px;
        }

        .issue-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
        }

        .urgency-options {
          display: grid;
          gap: 12px;
        }

        .urgency-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          background: #fafafa;
        }

        .urgency-option:hover {
          background: white;
        }

        .urgency-option.selected {
          background: white;
        }

        .urgency-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .location-input-group {
          display: flex;
          gap: 12px;
        }

        .location-button {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .location-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .time-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .time-option {
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          background: #fafafa;
        }

        .time-option:hover {
          border-color: #f87171;
          background: white;
        }

        .time-option.selected {
          border-color: #ef4444;
          background: #fef2f2;
        }

        .time-label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 4px;
        }

        .time-desc {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .form-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid #f3f4f6;
        }

        .nav-button {
          padding: 14px 28px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1rem;
          transition: all 0.2s;
          border: none;
        }

        .nav-button.secondary {
          background: #f9fafb;
          color: #374151;
          border: 2px solid #e5e7eb;
        }

        .nav-button.secondary:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }

        .nav-button.primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          margin-left: auto;
        }

        .nav-button.primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .nav-button.emergency {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          margin-left: auto;
          min-width: 220px;
          justify-content: center;
        }

        .nav-button.emergency:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        .nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .sos-header {
            padding: 15px 20px;
          }

          .form-content {
            padding: 20px 15px;
          }

          .form-card {
            padding: 25px;
          }

          .progress-steps {
            gap: 20px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .issue-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }

          .time-options {
            grid-template-columns: 1fr;
          }

          .location-input-group {
            flex-direction: column;
          }

          .form-navigation {
            flex-direction: column;
            gap: 15px;
          }

          .nav-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default SOSFormPage;
