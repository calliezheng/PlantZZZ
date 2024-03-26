import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from "./pages/Home";
import SignModal from "./pages/SignModal";
import Learn from "./pages/Learn";
import Quiz from "./pages/Quiz";
import DashboardStudent from './pages/DashboardStudent';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Manage the form state at the App level

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    const username = localStorage.getItem('username');
    setIsAuthenticated(!!user_id && !!username);
  }, []);

  const toggleModal = () => setShowModal(!showModal);
  const toggleForm = () => setIsSignUp(!isSignUp);

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
  };

  const authenticateUser = (isAuth: boolean) => {
    setIsAuthenticated(isAuth);
  };

  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <h1 className="text-4xl font-bold text-green-600">PlantZZZ.web.app</h1>
        <nav>
          <Link to="/" className="hover:text-green-600"> Home </Link>
          <Link to="/learn" className="hover:text-green-600"> Learn </Link>
          <Link to="/quiz" className="hover:text-green-600"> Quiz </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-green-600">Dashboard</Link>
              <button onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <button onClick={toggleModal}>Sign In / Sign Up</button>
          )}
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/dashboard" element={<DashboardStudent />} />
        </Routes>
        <SignModal
        showModal={showModal}
        toggleModal={toggleModal}
        isSignUp={isSignUp}
        toggleForm={toggleForm}
        authenticateUser={authenticateUser}
      />
      </Router>
    </div>
  );
}

export default App;
