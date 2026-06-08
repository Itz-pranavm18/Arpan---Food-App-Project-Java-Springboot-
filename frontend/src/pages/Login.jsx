import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(
    new URLSearchParams(window.location.search).get('expired') === 'true'
      ? 'Your session has expired. Please log in again.'
      : ''
  );
  const [loginType, setLoginType] = useState('customer'); // 'customer' or 'admin'
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/login', formData);
      const data = response.data;
      
      // Simple role check for the UI (Backend still fully secures the endpoints)
      if (loginType === 'admin' && data.role !== 'ADMIN') {
        setError('Access Denied. You are not an admin.');
        return;
      }

      login(data);
      if (data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card">
        <div className="login-tabs" style={{ display: 'flex', marginBottom: '1.5rem', borderBottom: '2px solid #f0f0f5' }}>
          <div 
            className={`login-tab ${loginType === 'customer' ? 'active' : ''}`}
            onClick={() => setLoginType('customer')}
            style={{ flex: 1, textAlign: 'center', padding: '0.8rem', cursor: 'pointer', fontWeight: 'bold', borderBottom: loginType === 'customer' ? '2px solid var(--primary)' : 'none', color: loginType === 'customer' ? 'var(--primary)' : 'var(--text-muted)' }}
          >
            Customer
          </div>
          <div 
            className={`login-tab ${loginType === 'admin' ? 'active' : ''}`}
            onClick={() => setLoginType('admin')}
            style={{ flex: 1, textAlign: 'center', padding: '0.8rem', cursor: 'pointer', fontWeight: 'bold', borderBottom: loginType === 'admin' ? '2px solid var(--primary)' : 'none', color: loginType === 'admin' ? 'var(--primary)' : 'var(--text-muted)' }}
          >
            Admin
          </div>
        </div>

        <h2>{loginType === 'admin' ? 'Admin Access' : 'Welcome Back'}</h2>
        <p>{loginType === 'admin' ? 'Log in to manage the system.' : 'Log in to order your favorite food.'}</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="mt-3">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-input"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', backgroundColor: loginType === 'admin' ? '#2f3542' : 'var(--primary)' }}>
            {loginType === 'admin' ? 'Login as Admin' : 'Login'}
          </button>
        </form>
        {loginType === 'customer' && (
          <p className="mt-3 text-center">
            Don't have an account? <Link to="/signup" className="highlight">Sign up</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
