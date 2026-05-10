import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ExpertList = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');

  const fetchExperts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/experts', {
        params: { page, limit: 10, category, name }
      });
      setExperts(response.data.experts);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, [page, category, name]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchExperts();
  };

  if (loading) return <div className="page">Loading...</div>;
  if (error) return <div className="page">Error: {error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Expert Listing</h1>
          <p>Find the right expert by category, name, or experience.</p>
        </div>
      </div>

      <form className="form-grid" onSubmit={handleSearch}>
        <label>
          Search by name
          <input
            type="text"
            placeholder="Search by name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Tech">Tech</option>
            <option value="Business">Business</option>
          </select>
        </label>
        <button className="button primary full-width" type="submit">Search</button>
      </form>

      <ul className="expert-list">
        {experts.map(expert => (
          <li key={expert._id} className="expert-card">
            <Link to={`/expert/${expert._id}`} className="expert-link">
              <div>
                <strong>{expert.name}</strong>
                <div className="expert-meta">
                  <span>{expert.category}</span>
                  <span>{expert.experience} years experience</span>
                  <span>Rating {expert.rating}</span>
                </div>
              </div>
              <span className="button secondary">View</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="pagination-row">
        <button className="button secondary" onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button className="button secondary" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ExpertList;