import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pb, checkConnection } from '../lib/pocketbase';
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
        const isConnected = await checkConnection();
        if (isConnected) {
          // Clear any previous connection warning
          setMessage((prevMessage) => 
            prevMessage?.includes('database') ? '' : prevMessage
          );
        }
      } catch (error) {
        console.error('Connection test failed:', error);
        // Only show warning if there's an actual error
        if (error.status !== 404) {
          setMessage('Warning: Database connection issue detected. Please check if PocketBase is running.');
        }
      }
    };

    const connectionCheck = setInterval(testConnection, 10000); // Check every 10 seconds
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

      // Attempt to create record with enhanced error handling
      try {
        // First verify the connection
        const isConnected = await checkConnection();
        if (!isConnected) {
          throw new Error('Database connection is not available');
        }

        // Log the actual request
        console.log('Attempting to create record with data:', submissionData);
        
        const record = await pb.collection('timeline_events').create(submissionData);
        console.log('Record created successfully:', record);
      } catch (createError) {
        console.error('Create record error:', createError);
        
        // Enhanced error detection
        if (createError.status === 401) {
          throw new Error('Authentication expired - please log in again');
        }
        
        if (createError.status === 403) {
          throw new Error('You do not have permission to create records');
        }

        // Enhanced error handling for various response formats
        if (createError.response?.data) {
          const errorDetails = Object.entries(createError.response.data)
            .map(([field, errors]) => {
              // Handle both array and string error messages
              const errorMsg = Array.isArray(errors) ? errors.join(', ') : errors;
              return `${field}: ${errorMsg}`;
            })
            .join('; ');
          throw new Error(`Validation failed - ${errorDetails}`);
        }

        // Check for specific error types
        if (createError.status === 400) {
          throw new Error('Invalid data provided - please check your input');
        }

        // Detailed fallback error message
        const errorMessage = 
          createError.message || 
          createError.response?.message ||
          createError.data?.message ||
          'Failed to create record - please try again';
        
        console.error('Detailed error:', {
          message: errorMessage,
          status: createError.status,
          data: createError.data,
          response: createError.response
        });
        
        throw new Error(errorMessage);
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
      const errorMsg = error.message || 'Unknown error occurred';
      console.error('Form submission error:', {
        message: errorMsg,
        originalError: error
      });
      setMessage('Error adding event: ' + errorMsg);
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
