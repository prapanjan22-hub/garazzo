import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FAQPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqCategories = [
    { key: 'all', label: 'All Questions', count: 24 },
    { key: 'general', label: 'General', count: 8 },
    { key: 'booking', label: 'Booking & Services', count: 6 },
    { key: 'emergency', label: 'Emergency SOS', count: 4 },
    { key: 'payment', label: 'Payment & Billing', count: 3 },
    { key: 'technical', label: 'Technical Support', count: 3 }
  ];

  const faqData = [
    {
      id: 1,
      category: 'general',
      question: 'How does the SOS Car Repair platform work?',
      answer: 'Our platform connects you with verified mechanics and automotive professionals across India. You can search for services, book appointments, get emergency assistance, and track service history all in one place. Our network includes certified mechanics who undergo thorough verification processes.'
    },
    {
      id: 2,
      category: 'general',
      question: 'Are all mechanics on your platform verified?',
      answer: 'Yes, all mechanics undergo a comprehensive verification process including background checks, certification validation, customer feedback analysis, and quality assessments. We maintain strict standards to ensure you receive professional service.'
    },
    {
      id: 3,
      category: 'booking',
      question: 'How do I book a service appointment?',
      answer: 'You can book services through our platform by browsing available mechanics, comparing ratings and prices, selecting your preferred service provider, choosing available time slots, and confirming your booking. You will receive instant confirmation and reminders.'
    },
    {
      id: 4,
      category: 'booking',
      question: 'Can I cancel or reschedule my appointment?',
      answer: 'Yes, you can cancel or reschedule appointments up to 2 hours before the scheduled time without any charges. For cancellations within 2 hours, a minimal cancellation fee may apply. You can manage appointments through your dashboard.'
    },
    {
      id: 5,
      category: 'emergency',
      question: 'How fast is emergency SOS response?',
      answer: 'Our emergency response team typically arrives within 15-30 minutes in major cities and within 45 minutes in suburban areas. Response time may vary based on location, traffic conditions, and availability of nearest service providers.'
    },
    {
      id: 6,
      category: 'emergency',
      question: 'What types of emergency services are available?',
      answer: 'We provide comprehensive emergency services including battery jump-start, flat tire assistance, engine breakdown support, towing services, fuel delivery, lockout assistance, and minor roadside repairs. Our teams are equipped to handle most common vehicle emergencies.'
    },
    {
      id: 7,
      category: 'payment',
      question: 'What payment methods are accepted?',
      answer: 'We accept multiple payment methods including credit/debit cards, digital wallets, UPI payments, net banking, and cash payments. All digital transactions are secured with industry-standard encryption.'
    },
    {
      id: 8,
      category: 'payment',
      question: 'Is there a warranty on services?',
      answer: 'Yes, all services come with a warranty period that varies by service type. Routine maintenance typically has 30-90 days warranty, major repairs have 6-12 months warranty, and parts replacement includes manufacturer warranty.'
    },
    {
      id: 9,
      category: 'technical',
      question: 'How do I track my service request?',
      answer: 'You can track your service request in real-time through our platform. You will receive SMS and app notifications for status updates, mechanic arrival, service progress, and completion. Live tracking is available during service appointments.'
    },
    {
      id: 10,
      category: 'general',
      question: 'What areas do you currently serve?',
      answer: 'We currently operate in major metropolitan cities including Delhi NCR, Mumbai, Bangalore, Chennai, Hyderabad, Pune, Kolkata, and Ahmedabad. We are rapidly expanding to tier-2 cities and highway corridors for emergency services.'
    },
    {
      id: 11,
      category: 'booking',
      question: 'Can I get a quote before booking?',
      answer: 'Yes, you can request quotes from multiple service providers before booking. Our platform provides transparent pricing with detailed breakdowns of labor costs, parts pricing, and any additional charges. No hidden fees guaranteed.'
    },
    {
      id: 12,
      category: 'technical',
      question: 'How do I report issues with service quality?',
      answer: 'You can report service quality issues through our customer support system, rate services in your booking history, or contact our quality assurance team directly. We take all feedback seriously and investigate complaints within 24 hours.'
    }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <div className="faq-container">
      {/* Header */}
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="header-content">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about our platform and services</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="categories-section">
        <div className="categories-container">
          <h3>Browse by Category</h3>
          <div className="categories-grid">
            {faqCategories.map(category => (
              <button
                key={category.key}
                className={`category-card ${activeCategory === category.key ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.key)}
              >
                <div className="category-content">
                  <span className="category-label">{category.label}</span>
                  <span className="category-count">{category.count} questions</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="faq-content">
        <div className="faq-container-inner">
          {filteredFAQs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>No questions found</h3>
              <p>Try adjusting your search or browse different categories</p>
            </div>
          ) : (
            <div className="faq-list">
              <div className="results-header">
                <h3>
                  {activeCategory === 'all' ? 'All Questions' : 
                   faqCategories.find(cat => cat.key === activeCategory)?.label}
                </h3>
                <span className="results-count">{filteredFAQs.length} questions found</span>
              </div>

              <div className="faq-items">
                {filteredFAQs.map(faq => (
                  <div 
                    key={faq.id} 
                    className={`faq-item ${expandedFAQ === faq.id ? 'expanded' : ''}`}
                  >
                    <button 
                      className="faq-question"
                      onClick={() => toggleFAQ(faq.id)}
                    >
                      <span className="question-text">{faq.question}</span>
                      <div className="expand-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </button>
                    
                    {expandedFAQ === faq.id && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Support Section */}
      <div className="support-section">
        <div className="support-card">
          <div className="support-content">
            <h3>Still need help?</h3>
            <p>Can't find the answer you're looking for? Our support team is here to help you 24/7.</p>
          </div>
          <div className="support-actions">
            <button className="support-button primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Live Chat Support
            </button>
            <button className="support-button secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Email Support
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .faq-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #fefbff 0%, #f8fafc 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .page-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 25px;
          display: flex;
          align-items: center;
          gap: 25px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .back-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 12px;
          border-radius: 10px;
          color: #64748b;
          transition: all 0.2s;
        }

        .back-button:hover {
          background: #f8fafc;
          color: #334155;
        }

        .header-content {
          flex: 1;
        }

        .header-content h1 {
          margin: 0 0 5px 0;
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b;
        }

        .header-content p {
          margin: 0;
          color: #64748b;
          font-size: 1rem;
        }

        .search-section {
          background: white;
          padding: 30px 25px;
          border-bottom: 1px solid #f1f5f9;
        }

        .search-container {
          max-width: 600px;
          margin: 0 auto;
        }

        .search-input-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .search-input {
          width: 100%;
          padding: 16px 20px 16px 50px;
          border: 2px solid #e2e8f0;
          border-radius: 50px;
          font-size: 1rem;
          transition: all 0.2s;
          background: #fafbfc;
        }

        .search-input:focus {
          outline: none;
          border-color: #7c3aed;
          background: white;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }

        .categories-section {
          padding: 40px 25px;
          background: white;
        }

        .categories-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .categories-container h3 {
          margin: 0 0 25px 0;
          font-size: 1.3rem;
          font-weight: 600;
          color: #374151;
          text-align: center;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .category-card {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .category-card:hover {
          border-color: #c4b5fd;
          background: #faf5ff;
        }

        .category-card.active {
          border-color: #7c3aed;
          background: #f3e8ff;
        }

        .category-content {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .category-label {
          font-weight: 600;
          color: #374151;
          font-size: 1rem;
        }

        .category-card.active .category-label {
          color: #7c3aed;
        }

        .category-count {
          font-size: 0.85rem;
          color: #6b7280;
        }

        .faq-content {
          padding: 40px 25px;
        }

        .faq-container-inner {
          max-width: 800px;
          margin: 0 auto;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          color: #64748b;
        }

        .empty-icon {
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-state h3 {
          margin: 0 0 10px 0;
          color: #374151;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f1f5f9;
        }

        .results-header h3 {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 600;
          color: #374151;
        }

        .results-count {
          font-size: 0.9rem;
          color: #64748b;
        }

        .faq-items {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .faq-item {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.2s;
        }

        .faq-item:hover {
          border-color: #cbd5e1;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .faq-item.expanded {
          border-color: #7c3aed;
        }

        .faq-question {
          width: 100%;
          background: none;
          border: none;
          padding: 25px;
          text-align: left;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          transition: all 0.2s;
        }

        .faq-question:hover {
          background: #fafbfc;
        }

        .question-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: #374151;
          line-height: 1.4;
        }

        .expand-icon {
          flex-shrink: 0;
          transition: transform 0.2s;
        }

        .faq-item.expanded .expand-icon {
          transform: rotate(180deg);
        }

        .faq-answer {
          padding: 0 25px 25px;
          border-top: 1px solid #f1f5f9;
          animation: slideDown 0.2s ease-out;
        }

        .faq-answer p {
          margin: 15px 0 0 0;
          color: #4b5563;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 200px;
          }
        }

        .support-section {
          padding: 50px 25px;
          background: linear-gradient(135deg, #7c3aed, #6366f1);
        }

        .support-card {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
        }

        .support-content h3 {
          margin: 0 0 10px 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: #374151;
        }

        .support-content p {
          margin: 0;
          color: #6b7280;
          line-height: 1.5;
        }

        .support-actions {
          display: flex;
          gap: 15px;
          flex-shrink: 0;
        }

        .support-button {
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .support-button.primary {
          background: linear-gradient(135deg, #7c3aed, #6366f1);
          color: white;
          border: none;
        }

        .support-button.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
        }

        .support-button.secondary {
          background: #f8fafc;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }

        .support-button.secondary:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .categories-grid {
            grid-template-columns: 1fr;
          }

          .results-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .support-card {
            flex-direction: column;
            text-align: center;
          }

          .support-actions {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
          }

          .faq-question {
            padding: 20px;
          }

          .question-text {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FAQPage;
