import React from 'react';
import '../styles/History.css';

const History = () => {
  const timelineEvents = [
    {
      year: 2024,
      title: "Zeit Tour",
      description: "World tour across 15 countries",
      image: "/images/zeit-tour.jpg",
      isLeft: true
    },
    {
      year: 2023,
      title: "Album Release - 'Echoes'",
      description: "Third studio album featuring collaborations with...",
      image: "/images/echoes-album.jpg",
      isLeft: false
    },
    {
      year: 2022,
      title: "Music Video - 'Darkness'",
      description: "Award-winning music video directed by...",
      image: "/images/darkness-video.jpg",
      isLeft: true
    },
    // Add more timeline events as needed
  ];

  return (
    <div className="history-page">
      <div className="timeline-container">
        <div className="timeline-line"></div>
        {timelineEvents.map((event, index) => (
          <div key={index}>
            <div className="year-marker">
              {event.year}
            </div>
            <div className={`timeline-event ${event.isLeft ? 'left' : 'right'}`}>
              <div className="timeline-content">
                <div className="event-details">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </div>
                <div className="event-media">
                  <img src={event.image} alt={event.title} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
