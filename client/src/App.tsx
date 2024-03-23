import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from "./pages/Home";
import SignModal from "./pages/SignModal";

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
          <button onClick={toggleModal}>Sign In / Sign Up</button>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
      {showModal && <SignModal toggleModal={toggleModal} />}
    </div>
  );
}

export default App;
