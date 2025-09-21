import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const CommunitiesPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discussions');
  const [newPost, setNewPost] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const API_BASE = 'https://garazzo.onrender.com/api';

  useEffect(() => {
    loadCommunityPosts();
  }, []);

  const loadCommunityPosts = async () => {
    try {
      const response = await fetch(`${API_BASE}/community/posts`);
      const data = await response.json();
      setPosts(data.data || []);
    } catch (error) {
      console.error('Error loading community posts:', error);
      // Use fallback data
      setPosts([
        {
          id: 1,
          userName: "AutoExpert_Delhi",
          content: "Professional tip: Regular maintenance every 5,000 km can prevent 80% of major engine issues. Don't wait for problems to appear - preventive care is always more cost-effective.",
          timestamp: "2 hours ago",
          likes: 45,
          comments: 12,
          category: "Maintenance Tips"
        },
        {
          id: 2,
          userName: "MechanicMaster",
          content: "For those experiencing AC issues in this weather: Check your cabin air filter first before calling for service. A clogged filter can reduce cooling efficiency by up to 40%.",
          timestamp: "4 hours ago",
          likes: 32,
          comments: 8,
          category: "Technical Advice"
        },
        {
          id: 3,
          userName: "CarOwner_BLR",
          content: "Just completed a 500km highway trip. Thanks to the SOS platform - had a minor battery issue near Pune and got help within 20 minutes. Excellent service quality and professional response.",
          timestamp: "1 day ago",
          likes: 78,
          comments: 15,
          category: "Experience Sharing"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleNewPost = async () => {
    if (!newPost.trim()) return;

    const post = {
      id: Date.now(),
      userName: "You",
      content: newPost,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      category: "General Discussion"
    };

    setPosts([post, ...posts]);
    setNewPost('');
    setShowNewPostModal(false);
  };

  return (
    <div className="communities-container">
      {/* Header */}
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="header-content">
          <h1>Community Hub</h1>
          <p>Connect with fellow car owners and automotive professionals</p>
        </div>

        <button 
          className="new-post-button"
          onClick={() => setShowNewPostModal(true)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          New Post
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs-container">
        <div className="tabs-list">
          {[
            { key: 'discussions', label: 'Discussions', count: posts.length },
            { key: 'tips', label: 'Tips & Guides', count: 24 },
            { key: 'reviews', label: 'Service Reviews', count: 156 },
            { key: 'marketplace', label: 'Marketplace', count: 12 }
          ].map(tab => (
            <button
              key={tab.key}
              className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="tab-label">{tab.label}</span>
              <span className="tab-count">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="content-section">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading community discussions...</p>
          </div>
        ) : (
          <div className="posts-container">
            {/* Community Stats */}
            <div className="community-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <span className="stat-number">12,450</span>
                  <span className="stat-label">Active Members</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <span className="stat-number">2,340</span>
                  <span className="stat-label">Discussions</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 11l3 3l8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <span className="stat-number">95%</span>
                  <span className="stat-label">Resolved Issues</span>
                </div>
              </div>
            </div>

            {/* Posts List */}
            <div className="posts-list">
              {posts.map(post => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <div className="user-info">
                      <div className="user-avatar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="user-details">
                        <h4 className="username">{post.userName}</h4>
                        <div className="post-meta">
                          <span className="timestamp">{post.timestamp}</span>
                          <span className="category-tag">{post.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="post-content">
                    <p>{post.content}</p>
                  </div>

                  <div className="post-actions">
                    <button 
                      className="action-button like"
                      onClick={() => handleLike(post.id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{post.likes}</span>
                    </button>

                    <button className="action-button comment">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{post.comments}</span>
                    </button>

                    <button className="action-button share">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="modal-overlay" onClick={() => setShowNewPostModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Post</h3>
              <button 
                className="close-button"
                onClick={() => setShowNewPostModal(false)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              <textarea
                className="post-textarea"
                placeholder="Share your automotive knowledge, ask questions, or discuss experiences..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows="6"
              />
            </div>
            
            <div className="modal-footer">
              <button 
                className="modal-button secondary"
                onClick={() => setShowNewPostModal(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-button primary"
                onClick={handleNewPost}
                disabled={!newPost.trim()}
              >
                Post Discussion
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .communities-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
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

        .new-post-button {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .new-post-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .tabs-container {
          background: white;
          border-bottom: 1px solid #f1f5f9;
          padding: 0 25px;
        }

        .tabs-list {
          display: flex;
          gap: 0;
          overflow-x: auto;
        }

        .tab-button {
          background: none;
          border: none;
          padding: 16px 20px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
          border-bottom: 2px solid transparent;
          white-space: nowrap;
          min-width: 120px;
        }

        .tab-button:hover {
          background: #f8fafc;
        }

        .tab-button.active {
          border-bottom-color: #3b82f6;
          background: #f8fafc;
        }

        .tab-label {
          font-weight: 600;
          color: #64748b;
          font-size: 0.9rem;
        }

        .tab-button.active .tab-label {
          color: #3b82f6;
        }

        .tab-count {
          font-size: 0.75rem;
          color: #94a3b8;
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 20px;
          text-align: center;
        }

        .tab-button.active .tab-count {
          background: #dbeafe;
          color: #3b82f6;
        }

        .content-section {
          padding: 25px;
        }

        .loading-state {
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

        .posts-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .community-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          transition: all 0.2s;
        }

        .stat-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          background: #f0f9ff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #64748b;
        }

        .posts-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .post-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 15px;
          padding: 25px;
          transition: all 0.2s;
        }

        .post-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .post-header {
          margin-bottom: 15px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: #f1f5f9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }

        .username {
          margin: 0 0 4px 0;
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
        }

        .post-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .timestamp {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .category-tag {
          background: #dbeafe;
          color: #3b82f6;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .post-content {
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .post-content p {
          margin: 0;
          color: #374151;
        }

        .post-actions {
          display: flex;
          gap: 20px;
          padding-top: 15px;
          border-top: 1px solid #f1f5f9;
        }

        .action-button {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.2s;
          font-size: 0.85rem;
          color: #64748b;
        }

        .action-button:hover {
          background: #f8fafc;
          color: #334155;
        }

        .action-button.like:hover {
          color: #3b82f6;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 15px;
          width: 100%;
          max-width: 600px;
          max-height: 80vh;
          overflow: hidden;
        }

        .modal-header {
          padding: 20px 25px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
        }

        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          color: #64748b;
          transition: all 0.2s;
        }

        .close-button:hover {
          background: #f8fafc;
        }

        .modal-body {
          padding: 25px;
        }

        .post-textarea {
          width: 100%;
          padding: 15px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
          line-height: 1.5;
          resize: vertical;
          transition: all 0.2s;
          font-family: inherit;
        }

        .post-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .modal-footer {
          padding: 20px 25px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .modal-button {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-button.secondary {
          background: #f8fafc;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }

        .modal-button.secondary:hover {
          background: #f1f5f9;
        }

        .modal-button.primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: none;
        }

        .modal-button.primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .modal-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
          }

          .header-content {
            text-align: center;
          }

          .content-section {
            padding: 15px;
          }

          .community-stats {
            grid-template-columns: 1fr;
          }

          .stat-card {
            text-align: center;
            flex-direction: column;
            gap: 10px;
          }

          .post-actions {
            justify-content: space-around;
          }

          .modal-overlay {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default CommunitiesPage;
