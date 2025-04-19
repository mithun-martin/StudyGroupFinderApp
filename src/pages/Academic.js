import React, { useState, useEffect } from "react";
import axios from "axios";

const Academic = () => {
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    year: "",
    branch: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [studyGroups, setStudyGroups] = useState([]);

  // Fetch all study groups on component mount
  useEffect(() => {
    const fetchStudyGroups = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/study-groups/all"
        );
        setStudyGroups(response.data);
      } catch (error) {
        console.error("Error fetching study groups:", error);
      }
    };

    fetchStudyGroups();
  }, []);

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
      const response = await axios.post(
        "http://localhost:8080/api/study-groups/create",
        formData
      );
      console.log("Study group created:", response.data);
      alert("Study group created successfully!");
      setFormData({
        subject: "",
        topic: "",
        year: "",
        branch: "",
      });
      setIsFormVisible(false);

      // Refresh the list
      const refreshedGroups = await axios.get(
        "http://localhost:8080/api/study-groups/all"
      );
      setStudyGroups(refreshedGroups.data);
    } catch (error) {
      console.error("Error creating study group:", error);
      alert("Failed to create study group!");
    }
  };

  return (
    <div className="academic-container">
      <h2 className="academic-title">Study Group</h2>

      <button
        onClick={() => setIsFormVisible(!isFormVisible)}
        className="create-group-button"
      >
        {isFormVisible ? "Cancel" : "Create Study Group"}
      </button>

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

      {/* View all study groups */}
      <div className="study-group-list">
        <h3>Available Study Groups</h3>
        {studyGroups.length === 0 ? (
          <p>No study groups available.</p>
        ) : (
          <ul>
            {studyGroups.map((group, index) => (
              <li key={index}>
                <strong>{group.subject}</strong> – {group.topic} ({group.year},{" "}
                {group.branch})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Academic;
