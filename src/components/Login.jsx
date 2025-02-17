import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FaApple } from 'react-icons/fa';
import { HiArrowLeft } from 'react-icons/hi';
import { supabase } from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        navigate('/home');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/home`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image-section">
        <div className="login-header">
          <img src="/logo.svg" alt="Logo" className="app-logo" />
          <a href="#" className="back-to-website">
            <HiArrowLeft /> Back to website
          </a>
        </div>
        <div className="login-image-content">
          <h1 className="image-title">Capturing Moments, Creating Memories</h1>
        </div>
      </div>

      <div className="login-form-section">
        <div className="login-box">
          <h1 className="login-title">Create an account</h1>
          <p className="login-subtitle">
            Already have an account? <a href="#">Log in</a>
          </p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleEmailLogin} className="login-form">
            <div className="input-group">
              <MdEmail className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="input-group">
              <RiLockPasswordLine className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          
          <div className="divider">
            <span>Or register with</span>
          </div>
          
          <div className="auth-buttons">
            <button 
              onClick={handleGoogleLogin} 
              className="google-button"
              disabled={loading}
            >
              <FcGoogle /> Google
            </button>
            <button 
              className="apple-button"
              disabled={loading}
            >
              <FaApple /> Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 