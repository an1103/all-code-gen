// LanguageModal.js

import React, { useState } from 'react';
import './LanguageModal.css';

const LanguageModal = ({ selectedLanguage, onLanguageChange }) => {
  const [language, setLanguage] = useState(selectedLanguage);
  const languages = ['English', 'Spanish', 'French', 'German'];

  const handleConfirm = () => {
    onLanguageChange(language);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Select Language</h2>
        <div className="language-grid">
          {languages.map((lang) => (
            <label key={lang} className="language-option">
              <input
                type="radio"
                name="language"
                value={lang}
                checked={language === lang}
                onChange={(e) => setLanguage(e.target.value)}
              />
              {lang}
            </label>
          ))}
        </div>
        <button onClick={handleConfirm} className="confirm-button">Confirm</button>
      </div>
    </div>
  );
};

export default LanguageModal;
