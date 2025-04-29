// src/App.tsx

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import MarathonDetails from './pages/MarathonDetails'; 
import Profile from './pages/Profile';
import Community from './pages/Community';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register navigation={undefined} />} />
        <Route path="/marathon/:id" element={<MarathonDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </Router>
  );
};

export default App;
