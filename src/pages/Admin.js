import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pb } from '../lib/pocketbase';
import '../styles/Admin.css';

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate('/login');
      return;
    }

    // Test PocketBase connection
    const testConnection = async () => {
      try {
        const result = await pb.collection('timeline_events').getList(1, 1);
        console.log('PocketBase connection test successful:', result);
      } catch (error) {
        console.error('PocketBase connection test failed:', error);
        setMessage('Warning: Database connection issue detected');
      }
    };

    testConnection();
  }, [navigate]);
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    description: '',
    image: '',
    isLeft: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Validate raw input first
      if (!formData.title.trim() || !formData.year || !formData.description.trim() || !formData.image.trim()) {
        throw new Error('All fields are required');
      }

      // Validate year format
      const yearNum = parseInt(formData.year, 10);
      if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
        throw new Error('Please enter a valid year between 1900 and 2100');
      }

      // Format data to match PocketBase schema field names and field IDs
      const formattedData = {
        title_field: formData.title.trim(),
        year_field: yearNum,
        desc_field: formData.description.trim(),
        img_field: formData.image.trim(),
        pos_field: Boolean(formData.isLeft)
      };

      // Additional validation logging
      console.log('Validated form data:', formData);
      console.log('Formatted data for PocketBase:', formattedData);

      // Attempt to create record with detailed error handling
      try {
        const record = await pb.collection('timeline_events').create(formattedData);
        console.log('Record created successfully:', record);
      } catch (createError) {
        console.error('Detailed create error:', {
          message: createError.message,
          data: createError.data,
          originalError: createError.originalError,
          response: createError.response
        });
        throw createError;
      }
      console.log('Record created:', record);
      
      setMessage('Event added successfully!');
      setFormData({
        title: '',
        year: '',
        description: '',
        image: '',
        isLeft: false
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
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="year">Year:</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description (HTML allowed):</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Image URL:</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="isLeft"
                checked={formData.isLeft}
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
