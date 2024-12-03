import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">ARTIST NAME</Link>
      </div>
      <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/music" className="nav-item">Music</Link>
        <Link to="/shows" className="nav-item">Shows</Link>
        <Link to="/about" className="nav-item">About</Link>
        <Link to="/contact" className="nav-item">Contact</Link>
      </div>
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;
