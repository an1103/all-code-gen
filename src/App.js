import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Discovery from './components/Learning/Discovery';

// import Register from './components/Auth/Register';
// import Profile from './components/Profile/Profile';
// import Practice from './components/Learning/Practice';
// import Showcase from './components/Learning/Showcase';
// import OnePlayerStory from './components/StoryMode/OnePlayerStory';
// import TwoPlayerStory from './components/StoryMode/TwoPlayerStory';
// import ProgressTracker from './components/Progress/ProgressTracker';
// import Feedback from './components/Progress/Feedback';
// import AdminDashboard from './components/Dashboard/AdminDashboard';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/discovery" element={<Discovery />} />
        {/* <Route path="/register" element={<Register/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/practice" element={<Practice/>} />
        <Route path="/showcase" element={<Showcase/>} />
        <Route path="/one-player-story" element={<OnePlayerStory/>} />
        <Route path="/two-player-story" element={<TwoPlayerStory/>} />
        <Route path="/progress-tracker" element={<ProgressTracker/>} />
        <Route path="/feedback" element={<Feedback/>} />
        <Route path="/admin-dashboard" element={<AdminDashboard/>} /> */}
      </Routes>
    </Router>
  );
};

export default App;

