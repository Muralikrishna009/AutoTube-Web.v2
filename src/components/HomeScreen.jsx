import { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import { FiClock, FiFileText, FiActivity } from 'react-icons/fi';

const HomeScreen = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner" />;
  }

  return (
    <div className="home-screen">
      <div className="welcome-section">
        <h1>Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}! 👋</h1>
        <p>Here's what you can do with AutoTube</p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">
            <FiClock />
          </div>
          <div className="feature-content">
            <h3>Stopwatch</h3>
            <p>Track your time with precision using our advanced stopwatch</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <FiFileText />
          </div>
          <div className="feature-content">
            <h3>Notes</h3>
            <p>Organize your thoughts and ideas in one secure place</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <FiActivity />
          </div>
          <div className="feature-content">
            <h3>Activity</h3>
            <p>Track your progress and stay motivated</p>
          </div>
        </div>
      </div>

      <div className="quick-stats">
        <h2>Quick Stats</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Notes</h4>
            <p className="stat-value">0</p>
          </div>
          <div className="stat-card">
            <h4>Time Tracked</h4>
            <p className="stat-value">0h</p>
          </div>
          <div className="stat-card">
            <h4>Last Activity</h4>
            <p className="stat-value">Today</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen; 