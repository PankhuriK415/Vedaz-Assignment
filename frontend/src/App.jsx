import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { UserContext } from './contexts/UserContext';
import ExpertList from './components/ExpertList';
import ExpertDetail from './components/ExpertDetail';
import BookingForm from './components/BookingForm';
import MyBookings from './components/MyBookings';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <Router>
      <div className="App">
        <header className="topbar">
          <div className="brand">Vedaz Experts</div>
          <div className="nav-links">
            <Link className="nav-button button secondary" to="/">Experts</Link>
            <Link className="nav-button button secondary" to="/my-bookings">My Bookings</Link>
            {!user && <Link className="nav-button button secondary" to="/login">Login</Link>}
            {!user && <Link className="nav-button button secondary" to="/register">Create User</Link>}
            {user && <button className="button secondary" onClick={logout}>Logout</button>}
          </div>
        </header>
        <main className="page-content">
          {user && <div className="user-banner">Logged in as {user.name} ({user.email})</div>}
          <Routes>
            <Route path="/" element={<ExpertList />} />
            <Route path="/expert/:id" element={<ExpertDetail />} />
            <Route path="/book/:id/:date/:timeSlot" element={<BookingForm />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
