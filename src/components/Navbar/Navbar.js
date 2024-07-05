import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api'; // Adjust the path as needed
import './Navbar.css';
import LanguageModal from '../LanguageModal/LanguageModal';

const Navbar = ({ username }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('selectedLanguage') || 'English');
  const [coins, setCoins] = useState(0);
  const location = useLocation();

  const toggleModal = () => {
    if (location.pathname === '/landing') {
      setShowModal(!showModal);
    }
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem('selectedLanguage', language);
    const langCode = {
      'English': 'en',
      'Tamil': 'ta',
      'Kannada': 'kn',
      'Telugu': 'te',
    }[language];
    api.setLanguage(langCode);
    toggleModal();
  };

  useEffect(() => {
    const langCode = {
      'English': 'en',
      'Tamil': 'ta',
      'Kannada': 'kn',
      'Telugu': 'te',
    }[selectedLanguage];
    api.setLanguage(langCode);

    const fetchCoins = async () => {
      const coinsData = await api.getCoins(username);
      setCoins(coinsData.coins);
    };

    fetchCoins();
  }, [username, selectedLanguage]);

  const handleBackClick = () => {
    // Logic to go back to the login page
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/images/back-icon.png" className="back-button" onClick={handleBackClick} alt="Back" />
        <div className="logo">{username}</div>
      </div>
      <div className="coins-container">
        <button onClick={toggleModal} className="language-button">
          {selectedLanguage}
        </button>
        {showModal && location.pathname === '/landing' && (
          <LanguageModal
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
        )}
        <img src="/images/coins.png" className="coins" alt="Coins" />
        <div className="coins-count">{coins}</div>
      </div>
    </nav>
  );
};

export default Navbar;
