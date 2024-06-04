import React from 'react';
import './Navbar.css'

const Navbar = ({ username }) => {
  return (
    <nav>
      <div className="navbar-container">
        <div className="logo">ALL</div>
        <div className="user-info">Welcome, {username}!</div>
      </div>
    </nav>
  );
};

export default Navbar;
