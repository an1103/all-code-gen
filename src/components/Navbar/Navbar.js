// Navbar.js

import React, { useState } from 'react';
import './Navbar.css';
import LanguageModal from '../LanguageModal/LanguageModal';

const Navbar = ({ username }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    toggleModal();
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <span>{username}</span>
      </div>
      <div className="navbar-right">
        <button onClick={toggleModal} className="language-button">
          {selectedLanguage}
        </button>
      </div>
      {showModal && (
        <LanguageModal
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />
      )}
    </div>
  );
};

export default Navbar;
