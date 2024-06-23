import React, { useEffect, useState } from 'react';
import api from '../../services/api'; // Adjust the path as needed
import './Navbar.css';

const Navbar = ({ username }) => {
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    const fetchCoins = async () => {
      const coinsData = await api.getCoins(username);
      setCoins(coinsData.coins);
    };

    fetchCoins();
  }, [username]);

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
        <img src="/images/coins.png" className="coins" alt="Coins" />
        <div className="coins-count">{coins}</div>
      </div>
    </nav>
  );
};

export default Navbar;
