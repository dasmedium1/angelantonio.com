import React from 'react';
import '../styles/Shows.css';

const Shows = () => {
  return (
    <div className="shows-page">
      <h1>Upcoming Shows</h1>
      <div className="shows-container">
        <div className="show-card">
          <div className="date">
            <span className="day">15</span>
            <span className="month">DEC</span>
          </div>
          <div className="show-info">
            <h3>Venue Name</h3>
            <p>City, Country</p>
            <button className="ticket-button">Get Tickets</button>
          </div>
        </div>
        {/* Add more show cards as needed */}
      </div>
    </div>
  );
};

export default Shows;
