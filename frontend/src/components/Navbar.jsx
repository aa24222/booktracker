import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="#" className="navbar-brand">
        <span className="navbar-logo">📚</span>
        <span className="navbar-title">Book Nook</span>
      </a>
      <div className="navbar-right">
        <div className="user-menu">
          <div className="user-avatar">A</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
