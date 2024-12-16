import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pb } from '../lib/pocketbase';
import '../styles/Admin.css';

const handleLogout = async (navigate) => {
  try {
    pb.authStore.clear();
    navigate('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [formData, setFormData] = useState({
    title_field: '',
    year_field: '',
    desc_field: '',
    img_field: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Initial auth check
  useEffect(() => {
    const checkAuth = () => {
      if (!pb.authStore.isValid) {
        navigate('/login');
        return false;
      }
      return true;
    };

    const isAuthed = checkAuth();
    setIsAuthChecking(false);

    // Set up periodic auth checks
    const authCheckInterval = setInterval(() => {
      checkAuth();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(authCheckInterval);
  }, [navigate]);

  // Session timeout check
  useEffect(() => {
    const checkSessionTimeout = () => {
      if (pb.authStore.isValid) {
        const tokenExp = new Date(pb.authStore.model.exp * 1000);
        const now = new Date();
        const timeUntilExp = tokenExp - now;
        
        if (timeUntilExp < 300000) { // Less than 5 minutes left
          alert('Your session will expire soon. Please save your work and re-login.');
        }
        
        if (timeUntilExp <= 0) {
          pb.authStore.clear();
          navigate('/login');
        }
      }
    };

    const timeoutCheck = setInterval(checkSessionTimeout, 60000); // Check every minute
    return () => clearInterval(timeoutCheck);
  }, [navigate]);

  // Protect against direct access while checking auth
  if (isAuthChecking) {
    return <div className="admin-page"><div className="admin-container">Verifying access...</div></div>;
  }

  // Immediate redirect if not authenticated
  if (!pb.authStore.isValid) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Basic validation
      if (!formData.title_field || !formData.year_field || !formData.desc_field || !formData.img_field) {
        throw new Error('All fields are required');
      }

      const yearNum = parseInt(formData.year_field, 10);
      if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
        throw new Error('Please enter a valid year between 1900 and 2100');
      }

      // Create the event data object
      const eventData = {
        title: formData.title_field.trim(),
        year: yearNum,
        description: formData.desc_field.trim(),
        image: formData.img_field.trim()
      };

      // Log the exact data being sent
      console.log('Submitting event data:', JSON.stringify(eventData, null, 2));

      console.log('Attempting to create event with data:', eventData);

      // Create the record
      const record = await pb.collection('timeline_events').create(eventData);
      console.log('Event created successfully:', record);
      
      // Clear form and show success message
      setFormData({
        title_field: '',
        year_field: '',
        desc_field: '',
        img_field: ''
      });
      setMessage('Event added successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      setMessage('Error: ' + (error.message || 'Failed to create event'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Timeline Admin</h1>
          <button 
            className="logout-button"
            onClick={() => handleLogout(navigate)}
          >
            Logout
          </button>
        </div>
        {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title_field">Title:</label>
            <input
              type="text"
              id="title_field"
              name="title_field"
              value={formData.title_field}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="year_field">Year:</label>
            <input
              type="number"
              id="year_field"
              name="year_field"
              value={formData.year_field}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="desc_field">Description (HTML allowed):</label>
            <textarea
              id="desc_field"
              name="desc_field"
              value={formData.desc_field}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="img_field">Image URL:</label>
            <input
              type="url"
              id="img_field"
              name="img_field"
              value={formData.img_field}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
