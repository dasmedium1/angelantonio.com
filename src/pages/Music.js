import React from 'react';
import '../styles/Music.css';

const Music = () => {
  return (
    <div className="music-page">
      <h1>Music</h1>
      <div className="albums-grid">
        <div className="album-card">
          <img src="/images/album1.jpg" alt="Album 1" />
          <h3>Album Title 1</h3>
          <p>Release Date: 2023</p>
          <div className="streaming-links">
            <a href="#spotify" className="stream-link">Spotify</a>
            <a href="#apple" className="stream-link">Apple Music</a>
            <a href="#youtube" className="stream-link">YouTube</a>
          </div>
        </div>
        {/* Add more album cards as needed */}
      </div>
    </div>
  );
};

export default Music;
