import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ExpertList from './components/ExpertList';
import ExpertDetail from './components/ExpertDetail';
import BookingForm from './components/BookingForm';
import MyBookings from './components/MyBookings';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">Experts</Link> | <Link to="/my-bookings">My Bookings</Link>
        </nav>
        <Routes>
          <Route path="/" element={<ExpertList />} />
          <Route path="/expert/:id" element={<ExpertDetail />} />
          <Route path="/book/:id/:date/:timeSlot" element={<BookingForm />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
