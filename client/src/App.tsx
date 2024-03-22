import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from "./pages/Home";
import SignModal from "./pages/SignModal";

function App() {
  return (
    <div className="App">
      <Router>
        <Link to="/"> Home </Link>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
