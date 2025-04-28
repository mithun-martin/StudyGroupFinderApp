import React, { useState, useEffect } from "react";
import { fetchStudyGroups, createStudyGroup, sendJoinRequest, fetchGroupMembers } from "../api"; // Import API functions
import { getFirestore, doc, getDoc } from "firebase/firestore"; 

const db = getFirestore(); 
const Academic = () => {
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    year: "",
    branch: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [studyGroups, setStudyGroups] = useState([]);
  const [groupMembers, setGroupMembers] = useState({});

  // Fetch all study groups on component mount
  useEffect(() => {
    const getStudyGroups = async () => {
      try {
        const groups = await fetchStudyGroups();
        console.log(groups); // Log groups to check if `id` is present
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
  const getUserNameByUID = async (uid) => {
    const docRef = doc(db, "users", uid);  // Assuming your users are stored in a collection called "users"
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().name;  // Assuming the user document has a "name" field
    } else {
      console.log("No such user!");
      return null;
    }
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

  const handleViewMembers = async (groupId) => {
    console.log("Group ID:", groupId);
    try {
      const members = await fetchGroupMembers(groupId); // Fetch members for the given groupId
      const membersWithNames = await Promise.all(members.map(async (member) => {
        const username = await getUserNameByUID(member.uid);  // Fetch the user name by UID
        return { ...member, name: username || "Unknown" }; // Add name to the member object
      }));
      setGroupMembers((prevMembers) => ({
        ...prevMembers,
        [groupId]: membersWithNames,  // Store the members with name
      }));
    } catch (error) {
      console.error("Error fetching group members:", error);
      alert("Failed to fetch members!");
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
                <strong>{group.subject}</strong> – {group.topic} ({group.year}, {group.branch})
                <div className="group-members">
                  

                  {groupMembers[group.id] ? (
                    groupMembers[group.id].length > 0 ? (
                      groupMembers[group.id].map((member, idx) => (
                        <p key={idx}>{member.name} ({member.email})</p>
                      ))
                    ) : (
                      <p>No members yet.</p>
                    )
                  ) : null}
                </div>
                <button 
  onClick={() => group.groupId && handleViewMembers(group.groupId)} 
  disabled={!group.groupId || group.groupId === ""}
>
  View Members
</button>

<button 
  onClick={() => group.groupId && handleJoinRequest(group.groupId)} 
  disabled={!group.groupId || group.groupId === ""}
>
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
