import React, { useState, useEffect } from "react";
import {
  fetchStudyGroups,
  createStudyGroup,
  sendJoinRequest,
  fetchGroupMembers,
  addStudyGroupMember,
  fetchUserById,
} from "../api";
import "./academic.css";

const getCurrentUserId = () => localStorage.getItem("userId");

const Academic = () => {
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    year: "",
    branch: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [studyGroups, setStudyGroups] = useState([]);
  const [expandedGroupId, setExpandedGroupId] = useState(null);
  const [membersByGroup, setMembersByGroup] = useState({});
  const [membersLoading, setMembersLoading] = useState({});

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const newGroup = await createStudyGroup(formData);
      const userId = getCurrentUserId();
      if (userId && newGroup.groupId) {
        await addStudyGroupMember(newGroup.groupId, userId);
      }
      alert("Study group created successfully!");
      setFormData({ subject: "", topic: "", year: "", branch: "" });
      setIsFormVisible(false);
      const refreshed = await fetchStudyGroups();
      setStudyGroups(refreshed);
    } catch (error) {
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
    } catch {
      alert("Failed to send join request.");
    }
  };

  const handleViewMembers = async (groupId) => {
    if (expandedGroupId === groupId) {
      setExpandedGroupId(null);
      return;
    }
    if (!membersByGroup[groupId]) {
      setMembersLoading((prev) => ({ ...prev, [groupId]: true }));
      try {
        const members = await fetchGroupMembers(groupId);
        const membersWithDetails = await Promise.all(
          members.map(async (member) => {
            let name = member.userId;
            let email = "";
            try {
              const user = await fetchUserById(member.userId);
              name = user.name || user.email || member.userId;
              email = user.email || "";
            } catch {}
            return { ...member, name, email };
          })
        );
        setMembersByGroup((prev) => ({ ...prev, [groupId]: membersWithDetails }));
      } catch {
        setMembersByGroup((prev) => ({ ...prev, [groupId]: [] }));
      } finally {
        setMembersLoading((prev) => ({ ...prev, [groupId]: false }));
      }
    }
    setExpandedGroupId(groupId);
  };

  return (
    <div className="academic-dark-bg">
      <div className="academic-card">
        <h1 className="academic-main-title">Find Your Own Study Group</h1>
        <p className="academic-subtitle">Collaborate. Learn. Succeed.</p>
        <button className="primary-btn" onClick={() => setIsFormVisible((v) => !v)}>
          {isFormVisible ? "Cancel" : "➕ Create Study Group"}
        </button>
        {isFormVisible && (
          <form className="dark-form" onSubmit={handleCreateGroup}>
            <input name="subject" placeholder="Subject" value={formData.subject} onChange={handleInputChange} required />
            <input name="topic" placeholder="Topic" value={formData.topic} onChange={handleInputChange} required />
            <input name="year" placeholder="Year" value={formData.year} onChange={handleInputChange} required />
            <input name="branch" placeholder="Branch" value={formData.branch} onChange={handleInputChange} required />
            <button className="primary-btn" type="submit">🚀 Submit Group</button>
          </form>
        )}
      </div>

      <div className="group-list-dark">
        {studyGroups.length === 0 ? (
          <p className="empty-text">No study groups yet. Start one!</p>
        ) : (
          studyGroups.map((group) => {
            const groupId = group.groupId || group.id;
            return (
              <div className="group-card-dark" key={groupId}>
                <div className="group-card-details">
                  <p><strong>Subject:</strong> {group.subject}</p>
                  <p><strong>Year:</strong> {group.year}</p>
                  <p><strong>Branch:</strong> {group.branch}</p>
                  <p><strong>Topic:</strong> {group.topic}</p>
                </div>
                <div className="group-actions">
                  <button className="accent-btn" onClick={() => handleJoinRequest(groupId)}>
                    Request to Join
                  </button>
                  <button className="secondary-btn" onClick={() => handleViewMembers(groupId)}>
                    {expandedGroupId === groupId ? "Hide Members" : "View Members"}
                  </button>
                </div>
                {expandedGroupId === groupId && (
                  <div className="members-list-dark">
                    {membersLoading[groupId] ? (
                      <p>Loading members...</p>
                    ) : membersByGroup[groupId] && membersByGroup[groupId].length > 0 ? (
                      membersByGroup[groupId].map((member, idx) => (
                        <div className="member-pill" key={idx}>
                          {member.name}
                          {member.email && (
                            <span style={{ color: "#888", fontSize: "0.95em" }}> ({member.email})</span>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>No members in this group yet.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Academic;
