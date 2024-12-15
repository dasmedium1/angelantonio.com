import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pb } from '../lib/pocketbase';
import '../styles/Admin.css';

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate('/login');
    }
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
    try {
      await pb.collection('timeline_events').create({
        ...formData,
        year: parseInt(formData.year)
      });
      setMessage('Event added successfully!');
      setFormData({
        title: '',
        year: '',
        description: '',
        image: '',
        isLeft: false
      });
    } catch (error) {
      setMessage('Error adding event: ' + error.message);
    }
    setIsLoading(false);
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
