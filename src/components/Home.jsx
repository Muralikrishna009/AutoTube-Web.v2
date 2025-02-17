import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { FiUser, FiMail, FiLogOut, FiHome, FiSettings, FiActivity, FiBell, FiMenu, FiX, FiFile, FiClock } from 'react-icons/fi';
import EditProfile from './EditProfile';
import ThemeToggle from './ThemeToggle';
import Stopwatch from './Stopwatch';
import Notes from './Notes';

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notes');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profile, setProfile] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const getProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Stopwatch />;
      case 'notes':
        return <Notes />;
      case 'settings':
        return (
          <>
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <FiActivity />
                </div>
                <div>
                  <h3>Profile Status</h3>
                  <p className="stat-value">Active</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FiUser />
                </div>
                <div>
                  <h3>Account Type</h3>
                  <p className="stat-value">Premium</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FiMail />
                </div>
                <div>
                  <h3>Last Login</h3>
                  <p className="stat-value">
                    {new Date(user?.last_sign_in_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile and Activity Sections */}
            <div className="dashboard-grid">
              <div className="profile-section">
                <div className="section-header">
                  <h2>Profile Information</h2>
                  <button 
                    className="edit-button"
                    onClick={() => setShowEditProfile(true)}
                  >
                    <FiSettings /> Edit Profile
                  </button>
                </div>
                <div className="profile-details">
                  <div className="profile-avatar">
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Profile" 
                        className="avatar-image"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '50%'
                        }}
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {user?.email?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="profile-info">
                    {profile?.full_name && (
                      <p><strong>Name:</strong> {profile.full_name}</p>
                    )}
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>ID:</strong> {user?.id}</p>
                    <p><strong>Provider:</strong> {user?.app_metadata?.provider || 'Email'}</p>
                    <p><strong>Created:</strong> {new Date(user?.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="activity-section">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon">
                      <FiUser />
                    </div>
                    <div className="activity-content">
                      <h4>Profile Updated</h4>
                      <p>You updated your profile information</p>
                      <span className="activity-time">2 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">
                      <FiMail />
                    </div>
                    <div className="activity-content">
                      <h4>Email Verified</h4>
                      <p>Your email address has been verified</p>
                      <span className="activity-time">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button className="mobile-nav-toggle" onClick={toggleMobileNav}>
          <FiMenu />
        </button>
        <img src="/logo.svg" alt="Logo" className="mobile-logo" />
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>

      {/* Sidebar Overlay */}
      {isMobileNavOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      {/* Sidebar with reordered navigation */}
      <aside className={`dashboard-sidebar ${isMobileNavOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <img src="/logo.svg" alt="Logo" className="sidebar-logo" />
          <h2>Dashboard</h2>
          <button 
            className="mobile-nav-toggle close"
            onClick={() => setIsMobileNavOpen(false)}
          >
            <FiX />
          </button>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <FiFile /> Notes
          </button>
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FiClock /> Stopwatch
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FiSettings /> Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-welcome">
            <h1>Welcome back</h1>
            <p className="user-email">
              <FiMail className="email-icon" />
              {user?.email}
            </p>
          </div>
          <div className="header-actions">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <button className="icon-button">
              <FiBell />
              <span className="notification-badge">2</span>
            </button>
            <button className="logout-button" onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {renderContent()}
        </div>
      </main>

      {showEditProfile && (
        <EditProfile 
          user={user}
          onClose={() => setShowEditProfile(false)}
          onUpdate={getProfile}
        />
      )}
    </div>
  );
};

export default Home;