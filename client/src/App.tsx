import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from "./pages/Home";
import SignModal from "./pages/SignModal";
import Learn from "./pages/Learn";
import DashboardStudent from './pages/DashboardStudent';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Manage the form state at the App level

  const toggleModal = () => setShowModal(!showModal);
  const toggleForm = () => setIsSignUp(!isSignUp);
  return (
    <div className="App">
      <Router>
        <nav>
          <Link to="/"> Home </Link>
          <Link to="/learn"> Learn </Link>
          <button onClick={toggleModal}>Sign In / Sign Up</button>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/dashboard" element={<DashboardStudent />} />
        </Routes>
        <SignModal
        showModal={showModal}
        toggleModal={toggleModal}
        isSignUp={isSignUp}
        toggleForm={toggleForm}
      />
      </Router>
    </div>
  );
}

export default App;
