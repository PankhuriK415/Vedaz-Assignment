import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ExpertList = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchExperts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/experts', {
        params: { page, limit: 10, category, name: searchQuery }
      });
      setExperts(response.data.experts);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, [page, category, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchQuery(searchTerm.trim());
  };

  if (loading) return <div className="page card"><p>Loading experts...</p></div>;
  if (error) return <div className="page card error-message">Error: {error}</div>;

  return (
    <div className="page card">
      <div className="page-header">
        <div>
          <h1>Expert Listing</h1>
          <p>Search by name or filter by category to find the right expert.</p>
        </div>
      </div>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          className="input"
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Tech">Tech</option>
          <option value="Business">Business</option>
          <option value="Marketing">Marketing</option>
          <option value="Design">Design</option>
          <option value="Finance">Finance</option>
          <option value="Health">Health</option>
        </select>
        <button className="button primary" type="submit">Search</button>
      </form>
      <ul className="expert-list">
        {experts.length === 0 ? (
          <li className="empty-state">No experts found.</li>
        ) : (
          experts.map((expert) => (
            <li className="expert-card" key={expert._id}>
              <Link to={`/expert/${expert._id}`}>
                <div>
                  <strong>{expert.name}</strong>
                  <p>{expert.category}</p>
                </div>
                <div className="expert-meta">
                  <span>{expert.experience} years</span>
                  <span>⭐ {expert.rating}</span>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
      <div className="pagination-row">
        <button className="button secondary" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button className="button secondary" onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ExpertList;