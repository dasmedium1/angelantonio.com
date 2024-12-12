import React, { useState, useEffect } from 'react';
import '../styles/History.css';

const History = () => {
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        const response = await fetch(process.env.PUBLIC_URL + '/data/timeline.json');
        if (!response.ok) {
          throw new Error('Failed to fetch timeline data');
        }
        const data = await response.json();
        setTimelineEvents(data.timelineEvents);
      } catch (err) {
        setError(err.message);
        console.error('Error loading timeline data:', err);
      }
    };

    fetchTimelineData();
  }, []);

  if (error) {
    return <div className="error-message">Error loading timeline: {error}</div>;
  }

  if (!timelineEvents.length) {
    return <div className="loading">Loading timeline...</div>;
  }

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
