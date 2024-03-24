import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from "./pages/Home";
import SignModal from "./pages/SignModal";
import Learn from "./pages/Learn";
import DashboardStudent from './pages/DashboardStudent';

function App() {

  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

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
        {showModal && <SignModal toggleModal={toggleModal} />}
      </Router>
    </div>
  );
}

export default App;
