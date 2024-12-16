import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pb, checkConnection } from '../lib/pocketbase';
import '../styles/Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate('/login');
    }
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
        image: formData.img_field.trim(),
        isLeft: formData.pos_field === true  // Explicit boolean comparison
      };

      console.log('Attempting to create event with data:', eventData);

      // Create the record
      const record = await pb.collection('timeline_events').create(eventData);
      console.log('Event created successfully:', record);
      
      // Clear form and show success message
      setFormData({
        title_field: '',
        year_field: '',
        desc_field: '',
        img_field: '',
        pos_field: false
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
