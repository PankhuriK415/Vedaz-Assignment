import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const Register = () => {
  const { register } = useContext(UserContext);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      await register(form);
      navigate('/');
    } catch (err) {
      console.error("Register API Error:", err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page card auth-card">
      <h1>Create User</h1>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" type="text" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        <button className="button primary" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      <p className="form-hint">Already have an account? <Link to="/login">Login here.</Link></p>
    </div>
  );
};

export default Register;
