// src/pages/Academic.js
import React, { useState, useEffect } from "react";
import { fetchStudyGroups, createStudyGroup, sendJoinRequest } from "../api"; // Import API functions

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
    const getStudyGroups = async () => {
      try {
        const groups = await fetchStudyGroups(); // Call the function from api.js
        setStudyGroups(groups);
      } catch (error) {
        console.error("Error fetching study groups:", error);
      }
    };

    getStudyGroups();
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
      const createdGroup = await createStudyGroup(formData); // Call the function from api.js
      console.log("Study group created:", createdGroup);
      alert("Study group created successfully!");
      setFormData({
        subject: "",
        topic: "",
        year: "",
        branch: "",
      });
      setIsFormVisible(false);

      // Refresh the list
      const refreshedGroups = await fetchStudyGroups(); // Call the function from api.js
      setStudyGroups(refreshedGroups);
    } catch (error) {
      console.error("Error creating study group:", error);
      alert("Failed to create study group!");
    }
  };

  // Handle the "Request to Join" button click
  const handleJoinRequest = async (groupId) => {
    try {
      const userId = "user-id-here"; // Replace with the actual user ID (from authentication context or state)
      await sendJoinRequest(groupId, userId); // Call the function to send the join request
      alert("Request to join the group has been sent!");
    } catch (error) {
      console.error("Error sending join request:", error);
      alert("Failed to send join request!");
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
                <div className="group-members">
                  <p>Members:</p>
                  {group.members.map((member, idx) => (
                    <p key={idx}>
                      {member.name} ({member.email})
                    </p>
                  ))}
                </div>
                {/* Request to Join Button */}
                <button onClick={() => handleJoinRequest(group.id)}>
                  Request to Join
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Academic;
