import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pb, checkConnection } from '../lib/pocketbase';
import '../styles/Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title_field: '',
    year_field: '',
    desc_field: '',
    img_field: '',
    pos_field: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate('/login');
      return;
    }

    // Test PocketBase connection
    const testConnection = async () => {
      try {
        const isConnected = await checkConnection();
        if (isConnected) {
          // Clear any previous connection warning
          setMessage((prevMessage) => 
            prevMessage?.includes('database') ? '' : prevMessage
          );
        } else {
          setMessage('Warning: Database connection issue detected. Please check if PocketBase is running.');
        }
      } catch (error) {
        console.error('Connection test failed:', error);
        setMessage('Warning: Database connection issue detected. Please check if PocketBase is running.');
      }
    };

    const connectionCheck = setInterval(testConnection, 5000); // Check every 5 seconds
    testConnection(); // Initial check

    return () => {
      clearInterval(connectionCheck); // Cleanup interval on unmount
    };
  }, [navigate]);
  const [formData, setFormData] = useState({
    title_field: '',
    year_field: '',
    desc_field: '',
    img_field: '',
    pos_field: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Validate raw input first
      if (!formData.title_field.trim() || !formData.year_field || !formData.desc_field.trim() || !formData.img_field.trim()) {
        throw new Error('All fields are required');
      }

      // Validate year format
      const yearNum = parseInt(formData.year_field, 10);
      if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
        throw new Error('Please enter a valid year between 1900 and 2100');
      }

      // Additional validation logging
      console.log('Validated form data:', formData);

      // Prepare data for submission
      const submissionData = {
        title_field: formData.title_field.trim(),
        year_field: yearNum,
        desc_field: formData.desc_field.trim(),
        img_field: formData.img_field.trim(),
        pos_field: Boolean(formData.pos_field)
      };

      console.log('Submission data:', submissionData);

      // Attempt to create record with detailed error handling
      try {
        const record = await pb.collection('timeline_events').create(submissionData);
        console.log('Record created successfully:', record);
        console.log('Record created:', record);
      } catch (createError) {
        console.error('Detailed create error:', {
          message: createError.message,
          data: createError.data,
          originalError: createError.originalError,
          response: createError.response
        });
        throw createError;
      }
      
      setMessage('Event added successfully!');
      setFormData({
        title_field: '',
        year_field: '',
        desc_field: '',
        img_field: '',
        pos_field: false
      });
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        data: error.data,
        status: error.status,
        response: error.response
      });
      setMessage('Error adding event: ' + (error.message || 'Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Timeline Admin</h1>
        {message && <div className="message">{message}</div>}
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
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="pos_field"
                checked={formData.pos_field}
                onChange={handleChange}
              />
              Position on left side
            </label>
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
