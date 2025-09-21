import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const RepairHistoryPage = () => {
  const navigate = useNavigate();
  const [repairHistory, setRepairHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // FIXED: Use useMemo to prevent mockRepairHistory from being recreated on every render
  const mockRepairHistory = useMemo(() => [
    {
      id: 'RH001',
      date: '2025-09-15',
      vehicle: 'Honda City 2020',
      registrationNumber: 'KA01AB1234',
      serviceProvider: "Professional Auto Services",
      services: ['Engine Oil Change', 'Air Filter Replacement', 'Battery Check'],
      totalAmount: 1450,
      status: 'completed',
      paymentMethod: 'Digital Payment',
      rating: 4.8,
      nextServiceDue: '2025-12-15',
      mileage: 15240,
      invoiceNumber: 'INV-2025-001',
      warranty: '6 months',
      technician: 'Rajesh Kumar',
      duration: '2.5 hours'
    },
    {
      id: 'RH002',
      date: '2025-08-22',
      vehicle: 'Honda City 2020',
      registrationNumber: 'KA01AB1234',
      serviceProvider: "Metro Garage Pro",
      services: ['Brake Pad Replacement', 'Brake Fluid Change'],
      totalAmount: 2200,
      status: 'completed',
      paymentMethod: 'Cash',
      rating: 4.5,
      nextServiceDue: '2026-02-22',
      mileage: 14850,
      invoiceNumber: 'INV-2025-002',
      warranty: '12 months',
      technician: 'Amit Singh',
      duration: '3 hours'
    },
    {
      id: 'RH003',
      date: '2025-09-20',
      vehicle: 'Honda City 2020',
      registrationNumber: 'KA01AB1234',
      serviceProvider: "Emergency Response Team",
      services: ['Emergency Battery Jump Start', 'Battery Replacement'],
      totalAmount: 3500,
      status: 'in-progress',
      paymentMethod: 'Pending',
      rating: null,
      nextServiceDue: '2026-09-20',
      mileage: 15280,
      invoiceNumber: 'INV-2025-003',
      warranty: '24 months',
      technician: 'Vikram Patel',
      duration: 'Ongoing'
    }
  ], []); // Empty dependency array since this data is static

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRepairHistory(mockRepairHistory);
      setLoading(false);
    };
    
    loadHistory();
  }, [mockRepairHistory]); // Now safe because mockRepairHistory is memoized

  const filteredHistory = repairHistory.filter(record => {
    const matchesSearch = record.serviceProvider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         record.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    return record.status === filterStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: '#10b981', bg: '#d1fae5', text: 'Completed' },
      'in-progress': { color: '#f59e0b', bg: '#fef3c7', text: 'In Progress' },
      cancelled: { color: '#ef4444', bg: '#fee2e2', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.completed;
    return (
      <span 
        style={{
          backgroundColor: config.bg,
          color: config.color,
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: '600'
        }}
      >
        {config.text}
      </span>
    );
  };

  return (
    <div className="repair-history-container">
      {/* Header */}
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="header-content">
          <h1>Vehicle Repair History</h1>
          <p>Complete service records and maintenance history</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{repairHistory.filter(r => r.status === 'completed').length}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              ₹{repairHistory.reduce((sum, record) => sum + record.totalAmount, 0).toLocaleString()}
            </span>
            <span className="stat-label">Total Spent</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="controls-section">
        <div className="search-container">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search by service provider, service type, or vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {[
            { key: 'all', label: 'All Records' },
            { key: 'completed', label: 'Completed' },
            { key: 'in-progress', label: 'In Progress' },
            { key: 'cancelled', label: 'Cancelled' }
          ].map(tab => (
            <button
              key={tab.key}
              className={`filter-tab ${filterStatus === tab.key ? 'active' : ''}`}
              onClick={() => setFilterStatus(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="content-section">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading repair history...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>No repair records found</h3>
            <p>Your vehicle maintenance history will appear here</p>
          </div>
        ) : (
          <div className="history-list">
            {filteredHistory.map(record => (
              <div key={record.id} className="history-card">
                <div className="card-header">
                  <div className="record-info">
                    <h3>{record.serviceProvider}</h3>
                    <div className="record-meta">
                      <span className="date">{new Date(record.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                      <span className="divider">•</span>
                      <span className="invoice">Invoice: {record.invoiceNumber}</span>
                    </div>
                  </div>
                  <div className="status-section">
                    {getStatusBadge(record.status)}
                    <span className="amount">₹{record.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="card-content">
                  <div className="vehicle-info">
                    <div className="vehicle-details">
                      <span className="vehicle-name">{record.vehicle}</span>
                      <span className="registration">{record.registrationNumber}</span>
                      <span className="mileage">{record.mileage.toLocaleString()} km</span>
                    </div>
                  </div>

                  <div className="services-list">
                    <h4>Services Performed</h4>
                    <div className="services-grid">
                      {record.services.map((service, index) => (
                        <div key={index} className="service-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {service}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="record-details">
                    <div className="detail-row">
                      <span className="detail-label">Technician</span>
                      <span className="detail-value">{record.technician}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Duration</span>
                      <span className="detail-value">{record.duration}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Payment</span>
                      <span className="detail-value">{record.paymentMethod}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Warranty</span>
                      <span className="detail-value">{record.warranty}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Next Service Due</span>
                      <span className="detail-value">
                        {new Date(record.nextServiceDue).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    {record.rating && (
                      <div className="detail-row">
                        <span className="detail-label">Rating</span>
                        <span className="detail-value rating">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                          </svg>
                          {record.rating}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-actions">
                  <button className="action-button secondary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Download Invoice
                  </button>
                  
                  {record.status === 'completed' && (
                    <button className="action-button primary">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 11l3 3l8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Book Again
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .repair-history-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
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
        .header-stats {
          display: flex;
          gap: 30px;
        }
        .stat-item {
          text-align: center;
        }
        .stat-number {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
        }
        .stat-label {
          font-size: 0.8rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .controls-section {
          background: white;
          padding: 20px 25px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .search-container {
          position: relative;
          flex: 1;
          max-width: 400px;
        }
        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }
        .search-input {
          width: 100%;
          padding: 12px 15px 12px 45px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #f8fafc;
          font-size: 14px;
          transition: all 0.2s;
        }
        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .filter-tabs {
          display: flex;
          gap: 5px;
        }
        .filter-tab {
          background: none;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          color: #64748b;
          transition: all 0.2s;
          font-size: 0.9rem;
        }
        .filter-tab:hover {
          background: #f8fafc;
          color: #334155;
        }
        .filter-tab.active {
          background: #3b82f6;
          color: white;
        }
        .content-section {
          padding: 25px;
        }
        .loading-state,
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          color: #64748b;
        }
        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }
        .empty-icon {
          margin-bottom: 20px;
          opacity: 0.5;
        }
        .empty-state h3 {
          margin: 0 0 10px 0;
          color: #374151;
        }
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .history-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 15px;
          overflow: hidden;
          transition: all 0.2s;
        }
        .history-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .card-header {
          padding: 25px 25px 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .record-info h3 {
          margin: 0 0 8px 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
        }
        .record-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #64748b;
        }
        .divider {
          color: #cbd5e1;
        }
        .status-section {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }
        .amount {
          font-size: 1.2rem;
          font-weight: 700;
          color: #059669;
        }
        .card-content {
          padding: 20px 25px;
        }
        .vehicle-info {
          margin-bottom: 20px;
          padding: 15px;
          background: #f8fafc;
          border-radius: 10px;
        }
        .vehicle-details {
          display: flex;
          gap: 20px;
          align-items: center;
        }
        .vehicle-name {
          font-weight: 600;
          color: #1e293b;
        }
        .registration,
        .mileage {
          font-size: 0.85rem;
          color: #64748b;
        }
        .services-list h4 {
          margin: 0 0 15px 0;
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
          margin-bottom: 20px;
        }
        .service-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #374151;
        }
        .service-item svg {
          color: #10b981;
          flex-shrink: 0;
        }
        .record-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #f1f5f9;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .detail-label {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 500;
        }
        .detail-value {
          font-size: 0.85rem;
          color: #374151;
          font-weight: 600;
        }
        .detail-value.rating {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .detail-value.rating svg {
          color: #fbbf24;
        }
        .card-actions {
          padding: 20px 25px 25px;
          display: flex;
          gap: 12px;
        }
        .action-button {
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .action-button.secondary {
          background: #f8fafc;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }
        .action-button.secondary:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }
        .action-button.primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: none;
        }
        .action-button.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          .header-stats {
            align-self: stretch;
            justify-content: space-around;
          }
          .controls-section {
            flex-direction: column;
            align-items: stretch;
          }
          .search-container {
            max-width: none;
          }
          .filter-tabs {
            justify-content: center;
          }
          .content-section {
            padding: 15px;
          }
          .card-header {
            flex-direction: column;
            gap: 15px;
          }
          .status-section {
            align-items: flex-start;
          }
          .vehicle-details {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .record-details {
            grid-template-columns: 1fr;
          }
          .card-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default RepairHistoryPage;
