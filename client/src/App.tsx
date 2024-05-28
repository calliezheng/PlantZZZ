import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Home from "./pages/Home";
import SignModal from "./pages/SignModal";
import Learn from "./pages/Learn";
import LearnDetail from "./pages/LearnDetail";
import ChooseQuiz from "./pages/ChooseQuiz";
import Quiz from "./pages/Quiz";
import QuizResult from "./pages/QuizResult";
import OriginalQuiz from "./pages/OriginalQuiz";
import OriginalQuizResult from "./pages/OriginalQuizResult";
import DashboardStudent from './pages/DashboardStudent';
import DashboardAdmin from './pages/DashboardAdmin';
import Profile from './pages/Profile';
import Password from './pages/Password';
import ManagePlant from './pages/ManagePlant';
import ManageStaff from './pages/ManageStaff';
import ManageProduct from './pages/ManageProduct';
import PlantLearned from './pages/PlantLearned';
import Store from './pages/Store';
import Cart from './pages/Cart';
import Garden from './pages/Garden';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); 
  
  useEffect(() => {
      const user_id = localStorage.getItem('user_id');
      const username = localStorage.getItem('username');
      const user_type = localStorage.getItem('user_type');
      if (user_id && username && user_type) {
        setIsAuthenticated(true);
      }
    }, []);

  const toggleModal = () => setShowModal(!showModal);
  const toggleForm = () => setIsSignUp(!isSignUp);

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('user_type');
    setIsAuthenticated(false);
  };

  const authenticateUser = (isAuth: boolean) => {
    setIsAuthenticated(isAuth);
  };

  return (
    <div className="App bg-hero-pattern min-h-screen bg-cover bg-center bg-no-repeat">
      <ToastContainer />
      <Router>
      <div className="flex flex-col w-full">
        <div className="flex flex-col items-start">
          <Link to="/" className="inline-block">
            <h1 className="text-8xl font-amatic font-bold text-green-600 text-left pl-8 hover:text-green-700">
              PlantZZZ.web.app
            </h1>
          </Link>
        </div>
        <nav className="flex items-start pl-8 space-x-4">
          <Link to="/" className="text-green-600 hover:text-green-700 font-poetsen font-bold text-2xl"> Home </Link>
          <Link to="/learn" className="text-green-600 hover:text-green-700 font-poetsen font-bold text-2xl"> Learn </Link>
          <Link to="/choosequiz" className="text-green-600 hover:text-green-700 font-poetsen font-bold text-2xl"> Quiz </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-green-600 hover:text-green-700 font-poetsen font-bold text-2xl mr-2">Dashboard</Link>
              <Link to="/" ><button onClick={handleLogout} className="text-green-600 hover:text-green-700 font-poetsen font-bold text-2xl mr-2">Log Out</button></Link>
            </>
          ) : (
            <button onClick={toggleModal} className="text-green-600 hover:text-green-700 font-poetsen font-bold text-2xl mr-2">Sign In / Sign Up</button>
          )}
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learndetail/:id" element={<LearnDetail />} />
        <Route path="/choosequiz" element={<ChooseQuiz />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quizresult" element={<QuizResult />} />
        <Route path="/originalquiz" element={<OriginalQuiz />} />
        <Route path="/originalquizresult" element={<OriginalQuizResult />} />
        <Route path="/dashboard" element={Number(localStorage.getItem('user_type')) === 1 ? <DashboardAdmin /> : <DashboardStudent />} />
        <Route path="/dashboard/profile/:id" element={<Profile />} />
        <Route path="/dashboard/profile/:id/password" element={<Password />} />
        <Route path="/dashboard/profile/:id/manageplant" element={<ManagePlant />} />
        <Route path="/dashboard/profile/:id/managestaff" element={<ManageStaff />} />
        <Route path="/dashboard/profile/:id/manageproduct" element={<ManageProduct />} />
        <Route path="/dashboard/learned plant/:id" element={<PlantLearned />} />
        <Route path="/dashboard/store/:id" element={<Store />} />
        <Route path="/dashboard/store/:id/cart" element={<Cart />} />
        <Route path="/dashboard/garden/:id" element={<Garden />} />
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
