import React, { useState } from 'react';
import axios from 'axios';

const Academic = () => {
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    year: '',
    branch: '',
  });
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      // Post request to backend API to create the group
      const response = await axios.post('http://localhost:8080/api/study-groups/create', formData);
      console.log('Study group created:', response.data);
      alert('Study group created successfully!');
      // Optionally reset form or hide form after submission
      setFormData({
        subject: '',
        topic: '',
        year: '',
        branch: '',
      });
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error creating study group:', error);
      alert('Failed to create study group!');
    }
  };

  return (
    <div className="academic-container">
      <h2 className="academic-title">Study Group</h2>
      
      {/* Button to toggle form visibility */}
      <button
        onClick={() => setIsFormVisible(!isFormVisible)}
        className="create-group-button"
      >
        {isFormVisible ? 'Cancel' : 'Create Study Group'}
      </button>

      {/* Form to create study group */}
      {isFormVisible && (
        <form className="create-group-form" onSubmit={handleCreateGroup}>
          <label>
            Subject:
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Topic:
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Year:
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Branch:
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              required
            />
          </label>
          <button type="submit">Submit Group</button>
        </form>
      )}
    </div>
  );
};

export default Academic;
