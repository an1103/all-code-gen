import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Discovery from './components/Learning/Discovery';
import LanguageAssessment from './components/LanguageAssessment/LanguageAssessment';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/discovery" element={<Discovery />} />
        <Route path="/language-assessment" element={<LanguageAssessment />} />
      </Routes>
    </Router>
  );
};

export default App;

