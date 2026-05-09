import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const Login = () => {
  const { login } = useContext(UserContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail) => {
    setLoading(true);
    setError(null);
    try {
      await login({ email: demoEmail, password: 'demo123' });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page card auth-card">
      <h1>Login</h1>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        <button className="button primary" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      <p className="form-hint">Need an account? <Link to="/register">Create one here.</Link></p>
      <div className="demo-actions">
        <span>Demo accounts:</span>
        <button className="button secondary" type="button" onClick={() => handleDemoLogin('demo1@example.com')} disabled={loading}>
          Demo 1
        </button>
        <button className="button secondary" type="button" onClick={() => handleDemoLogin('demo2@example.com')} disabled={loading}>
          Demo 2
        </button>
        <button className="button secondary" type="button" onClick={() => handleDemoLogin('demo3@example.com')} disabled={loading}>
          Demo 3
        </button>
      </div>
    </div>
  );
};

export default Login;
