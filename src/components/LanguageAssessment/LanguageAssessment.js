// LanguageAssessment.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LanguageAssessment.css';

const LanguageAssessment = () => {
  const navigate = useNavigate();

  const startAssessment = () => {
    // Redirect to Discovery page
    navigate('/discovery');
  };

  return (
    <div className="assessment-container">
      <h2>Let's test your language skills.</h2>
      <p>Take the assessment to discover your level.</p>
      <button onClick={startAssessment}>Start Assessment</button>
    </div>
  );
};

export default LanguageAssessment;
