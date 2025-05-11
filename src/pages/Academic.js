import React, { useState, useEffect } from "react";
import {
  fetchStudyGroups,
  createStudyGroup,
  sendJoinRequest,
  fetchGroupMembers,
  addStudyGroupMember,
  fetchUserById,
} from "../api";

// Helper to get backend userId from localStorage
const getCurrentUserId = () => localStorage.getItem("userId");

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
  const [membersLoading, setMembersLoading] = useState({}); // Track loading state for each group

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

  // Create group and add creator as member
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      // 1. Create the study group
      const newGroup = await createStudyGroup(formData);

      // 2. Get the current user's backend userId (from localStorage)
      const userId = getCurrentUserId();

      // 3. Add the creator as a member
      if (userId && newGroup.groupId) {
        await addStudyGroupMember(newGroup.groupId, userId);
      } else {
        alert("Could not add creator as member: Missing userId or groupId");
      }

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

  // Handle join request
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

  // View group members
  const handleViewMembers = async (groupId) => {
    if (expandedGroupId === groupId) {
      setExpandedGroupId(null);
      return;
    }

    // If not already loaded, fetch members
    if (!membersByGroup[groupId]) {
      setMembersLoading((prev) => ({ ...prev, [groupId]: true }));
      try {
        // 1. Fetch StudyGroupMember entries for this group
        const members = await fetchGroupMembers(groupId);

        // 2. For each member, fetch user info (name/email)
        const membersWithNames = await Promise.all(
          members.map(async (member) => {
            let name = member.userId;
            try {
              const user = await fetchUserById(member.userId);
              name = user.name || user.email || member.userId;
            } catch {
              // fallback to userId if fetch fails
            }
            return { ...member, name };
          })
        );

        setMembersByGroup((prev) => ({ ...prev, [groupId]: membersWithNames }));
      } catch (error) {
        console.error("Error fetching group members:", error);
        alert("Failed to load group members.");
        setMembersByGroup((prev) => ({ ...prev, [groupId]: [] }));
      } finally {
        setMembersLoading((prev) => ({ ...prev, [groupId]: false }));
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
          studyGroups.map((group) => {
            const groupId = group.groupId || group.id;
            return (
              <li key={groupId}>
                <strong>{group.subject}</strong> – {group.topic} ({group.year},{" "}
                {group.branch})
                <br />
                <button onClick={() => handleJoinRequest(groupId)}>
                  Request to Join
                </button>
                <button onClick={() => handleViewMembers(groupId)}>
                  {expandedGroupId === groupId ? "Hide Members" : "View Members"}
                </button>

                {expandedGroupId === groupId && (
                  membersLoading[groupId] ? (
                    <p>Loading members...</p>
                  ) : membersByGroup[groupId] && membersByGroup[groupId].length > 0 ? (
                    <ul>
                      {membersByGroup[groupId].map((member, idx) => (
                        <li key={idx}>
                          {member.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No members in this group yet.</p>
                  )
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default Academic;