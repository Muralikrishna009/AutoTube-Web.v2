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
        }
      });

      if (error) throw error;
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-container">
      <div className="auth-left-section">
        <div className="auth-left-header">
          <div className="brand-logo">
            <img src="/logo.svg" alt="Logo" />
          </div>
          <a href="#" className="back-link">
            <HiArrowLeft /> Back to website
          </a>
        </div>
        <div className="auth-left-content">
          <h1>Capturing Moments,<br />Creating Memories</h1>
        </div>
      </div>

      <div className="auth-right-section">
        <div className="auth-form-container">
          <h1>Create an account</h1>
          <p className="auth-subtitle">
            Already have an account? <a href="#">Log in</a>
          </p>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="auth-form">
            <div className="form-group">
              <div className="input-icon-wrapper">
                <MdEmail className="input-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-icon-wrapper">
                <RiLockPasswordLine className="input-icon" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="auth-button primary"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="auth-divider">
            <span>Or register with</span>
          </div>

          <div className="social-buttons">
            <button
              onClick={handleGoogleLogin}
              className="auth-button google"
              disabled={loading}
            >
              <FcGoogle />
              <span>Google</span>
            </button>
            <button
              className="auth-button apple"
              disabled={loading}
            >
              <FaApple />
              <span>Apple</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 