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
        <header className="topbar">
          <div className="brand">Vedaz Experts</div>
          <div className="nav-links">
            <Link className="nav-button button secondary" to="/">Experts</Link>
            <Link className="nav-button button secondary" to="/my-bookings">My Bookings</Link>
          </div>
        </header>
        <main className="page-content">
          <Routes>
            <Route path="/" element={<ExpertList />} />
            <Route path="/expert/:id" element={<ExpertDetail />} />
            <Route path="/book/:id/:date/:timeSlot" element={<BookingForm />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
