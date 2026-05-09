import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5001');

const ExpertDetail = () => {
  const { id } = useParams();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpert = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/experts/${id}`);
      setExpert(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpert();
    socket.on('slotUpdated', (data) => {
      if (data.expertId === id) {
        fetchExpert(); // Refresh slots
      }
    });
    return () => socket.off('slotUpdated');
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!expert) return <div>Expert not found</div>;

  const groupedSlots = expert.availableSlots.reduce((acc, slot) => {
    const date = new Date(slot.date).toDateString();
    acc[date] = slot.slots;
    return acc;
  }, {});

  return (
    <div>
      <h1>{expert.name}</h1>
      <p>Category: {expert.category}</p>
      <p>Experience: {expert.experience} years</p>
      <p>Rating: {expert.rating}</p>
      <h2>Available Slots</h2>
      {Object.entries(groupedSlots).map(([date, slots]) => (
        <div key={date}>
          <h3>{date}</h3>
          <ul>
            {slots.map(slot => (
              <li key={slot}>
                <Link to={`/book/${id}/${date}/${slot}`}>{slot}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ExpertDetail;