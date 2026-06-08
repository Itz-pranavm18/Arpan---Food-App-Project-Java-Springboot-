import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/register', formData);
      login(response.data);
      navigate('/');
    } catch (err) {
      setError('Username may already exist or invalid input');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card">
        <h2>Create Account</h2>
        <p>Join us and start ordering delicious food.</p>
        
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
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Sign Up
          </button>
        </form>
        <p className="mt-3 text-center">
          Already have an account? <Link to="/login" className="highlight">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
