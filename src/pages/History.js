import React, { useState, useEffect } from 'react';
import { pb } from '../lib/pocketbase';
import '../styles/History.css';

const History = () => {
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [error, setError] = useState(null);
  const [currentYear, setCurrentYear] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const events = document.querySelectorAll('.timeline-event');
      const markerPosition = 180; // Match the CSS top position
      const scrollPosition = window.scrollY + markerPosition;

      let currentEventYear = '';
      events.forEach((event) => {
        const eventTop = event.offsetTop;
        const eventBottom = eventTop + event.offsetHeight;
        
        if (scrollPosition >= eventTop && scrollPosition <= eventBottom) {
          currentEventYear = event.getAttribute('data-year');
        }
      });

      if (currentEventYear) {
        setCurrentYear(currentEventYear);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const fetchTimelineData = async () => {
      try {
        // Only fetch if component is still mounted
        if (isSubscribed) {
          const records = await pb.collection('timeline_events').getFullList({
            sort: 'year',
            requestKey: 'timeline_list' // Unique request key to prevent auto-cancellation conflicts
          });
          setTimelineEvents(records);
        }
      } catch (err) {
        // Ignore auto-cancellation errors
        if (!err.isAbort) {
          setError(err.message);
          console.error('Error loading timeline data:', err);
        }
      }
    };

    // Initial data fetch
    fetchTimelineData();

    // Subscribe to realtime updates
    const unsubscribe = pb.collection('timeline_events').subscribe('*', () => {
      if (isSubscribed) {
        fetchTimelineData();
      }
    });

    // Cleanup function
    return () => {
      isSubscribed = false;
      if (unsubscribe) {
        pb.collection('timeline_events').unsubscribe('*');
      }
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
            <div className={`timeline-event ${event.isLeft === true ? 'left' : 'right'}`} data-year={event.year}>
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
