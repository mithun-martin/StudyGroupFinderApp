// src/pages/Academic.js
import React, { useState, useEffect } from "react";
import {
  fetchStudyGroups,
  createStudyGroup,
  sendJoinRequest,
  fetchGroupMembers,
} from "../api";
import { getCurrentUserId } from "../firebase";

const Academic = () => {
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    year: "",
    branch: "",
  });
  const [expandedGroupId, setExpandedGroupId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [studyGroups, setStudyGroups] = useState([]);
  const [membersByGroup, setMembersByGroup] = useState({});

  // Fetch study groups on mount
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const groups = await fetchStudyGroups();
        setStudyGroups(groups);
      } catch (error) {
        console.error("Error fetching study groups:", error);
      }
    };
    loadGroups();
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
      await createStudyGroup(formData);
      alert("Study group created successfully!");
      setFormData({ subject: "", topic: "", year: "", branch: "" });
      setIsFormVisible(false);
      const refreshed = await fetchStudyGroups();
      setStudyGroups(refreshed);
    } catch (error) {
      console.error("Error creating study group:", error);
      alert("Failed to create study group.");
    }
  };

  const handleJoinRequest = async (groupId) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        alert("You must be logged in to send a join request.");
        return;
      }
      await sendJoinRequest(groupId, userId);
      alert("Join request sent!");
    } catch (error) {
      console.error("Error sending join request:", error);
      alert("Failed to send join request.");
    }
  };

  const handleViewMembers = async (groupId) => {
    if (expandedGroupId === groupId) {
      setExpandedGroupId(null);
      return;
    }

    if (!membersByGroup[groupId]) {
      try {
        const members = await fetchGroupMembers(groupId);
        setMembersByGroup((prev) => ({ ...prev, [groupId]: members }));
      } catch (error) {
        console.error("Error fetching group members:", error);
        alert("Failed to load group members.");
      }
    }

    setExpandedGroupId(groupId);
  };

  return (
    <div className="academic-container">
      <h2>Study Groups</h2>

      <button onClick={() => setIsFormVisible(!isFormVisible)}>
        {isFormVisible ? "Cancel" : "Create Study Group"}
      </button>

      {isFormVisible && (
        <form onSubmit={handleCreateGroup}>
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="topic"
            placeholder="Topic"
            value={formData.topic}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="branch"
            placeholder="Branch"
            value={formData.branch}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Submit Group</button>
        </form>
      )}

      <ul>
        {studyGroups.length === 0 ? (
          <p>No study groups available.</p>
        ) : (
          studyGroups.map((group, index) => (
            <li key={index}>
              <strong>{group.subject}</strong> – {group.topic} ({group.year},{" "}
              {group.branch})<br />
              <button onClick={() => handleJoinRequest(group.groupId)}>
                Request to Join
              </button>
              <button onClick={() => handleViewMembers(group.groupId)}>
                {expandedGroupId === group.groupId ? "Hide Members" : "View Members"}
              </button>

              {expandedGroupId === group.groupId && membersByGroup[group.groupId] && (
  membersByGroup[group.groupId].length > 0 ? (
    <ul>
      {membersByGroup[group.groupId].map((member, idx) => (
        <li key={idx}>
          {member.name || member.displayName || member.uid}
        </li>
      ))}
    </ul>
  ) : (
    <p>No members in this group yet.</p>
  )
)}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Academic;
