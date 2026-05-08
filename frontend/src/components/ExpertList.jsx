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
      const response = await axios.get('http://localhost:5000/experts', {
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Expert Listing</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Tech">Tech</option>
          <option value="Business">Business</option>
        </select>
        <button type="submit">Search</button>
      </form>
      <ul>
        {experts.map(expert => (
          <li key={expert._id}>
            <Link to={`/expert/${expert._id}`}>
              {expert.name} - {expert.category} - Exp: {expert.experience} - Rating: {expert.rating}
            </Link>
          </li>
        ))}
      </ul>
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
      <span>Page {page} of {totalPages}</span>
      <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
    </div>
  );
};

export default ExpertList;