import React from 'react';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <h1>ARTIST NAME</h1>
        <p>Singer | Songwriter | Performer</p>
        <button className="cta-button">Listen Now</button>
      </div>
      
      <div className="latest-release">
        <h2>Latest Release</h2>
        <div className="release-card">
          <img src="/path-to-album-cover.jpg" alt="Latest Album" />
          <h3>Album Title</h3>
          <p>Stream it now on all platforms</p>
          <div className="streaming-links">
            {/* Add your streaming service links here */}
          </div>
        </div>
      </div>
      
      <div className="upcoming-shows">
        <h2>Upcoming Shows</h2>
        <div className="shows-grid">
          {/* Add your show dates here */}
        </div>
      </div>
    </div>
  );
};

export default Home;
