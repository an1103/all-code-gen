import React from 'react';
import './Navbar.css';

const Navbar = ({ username }) => {
  return (
    <nav className="navbar">
      <div className="logo">ALL App</div>
      <div className="username">{username}</div>
    </nav>
  );
};

export default Navbar;
