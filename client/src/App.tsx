import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from "./pages/Home";
import Sign from "./pages/Sign";

function App() {
  return (
    <div className="App">
      <Router>
        <Link to="/sign"> Sign up/ Sign in </Link>
        <Link to="/"> Home </Link>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign" element={<Sign />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
