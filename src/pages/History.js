import React, { useState, useEffect } from 'react';
import '../styles/History.css';

const History = () => {
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [error, setError] = useState(null);
  const [currentYear, setCurrentYear] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const events = document.querySelectorAll('.timeline-event');
      const scrollPosition = window.scrollY + 120; // Match the CSS top position

      events.forEach((event) => {
        const eventPosition = event.offsetTop;
        if (eventPosition <= scrollPosition) {
          const year = event.getAttribute('data-year');
          setCurrentYear(year);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchTimelineData = async () => {
      // Add cache-busting query parameter
      const timestamp = new Date().getTime();
      console.log('Fetching timeline data...');
      try {
        const response = await fetch(`/data/timeline.json?t=${timestamp}`);
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
    
    // Refresh every 5 seconds in development mode
    let interval;
    if (process.env.NODE_ENV === 'development') {
      interval = setInterval(fetchTimelineData, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
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
        <div className="floating-year-marker">
          <span>{currentYear}</span>
        </div>
        {timelineEvents.map((event, index) => (
          <div key={index}>
            <div className={`timeline-event ${event.isLeft ? 'left' : 'right'}`} data-year={event.year}>
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
