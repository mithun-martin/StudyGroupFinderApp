import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import "./academic.css";

const Academic = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [studyGroups, setStudyGroups] = useState([]);
  const [newGroup, setNewGroup] = useState({ subject: "", topic: "" });
  const [loading, setLoading] = useState(true);

  const handleCreateGroup = async () => {
    if (!newGroup.subject || !newGroup.topic) return;

    try {
      const res = await fetch("/api/study-groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: newGroup.subject,
          topic: newGroup.topic,
          uid: getAuth().currentUser.uid,
        }),
      });

      if (!res.ok) throw new Error("Group creation failed");

      const createdGroup = await res.json();
      setStudyGroups([...studyGroups, createdGroup]); // Append to list
      setNewGroup({ subject: "", topic: "" }); // Reset form
    } catch (err) {
      console.error("Create group error:", err);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const uid = user.uid;

          const res = await fetch(`/api/users/${uid}`);
          if (!res.ok) throw new Error("Failed to fetch user data");

          const data = await res.json();
          setUserInfo(data);

          const groupRes = await fetch(
            `/api/study-groups?year=${data.year}&branch=${data.branch}`
          );
          if (!groupRes.ok) throw new Error("Failed to fetch study groups");

          const groups = await groupRes.json();
          setStudyGroups(groups);
        } else {
          console.log("No user is logged in.");
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="academic-container">
      <h1 className="academic-title">Academic Page</h1>

      {userInfo ? (
        <div className="user-info-box">
          <p>
            <span className="user-info-label">Name:</span>{" "}
            <span className="user-info-value">{userInfo.name}</span>
          </p>
          <p>
            <span className="user-info-label">Email:</span>{" "}
            <span className="user-info-value">{userInfo.email}</span>
          </p>
          <p>
            <span className="user-info-label">Year:</span>{" "}
            <span className="user-info-value">{userInfo.year}</span>
          </p>
          <p>
            <span className="user-info-label">Branch:</span>{" "}
            <span className="user-info-value">{userInfo.branch}</span>
          </p>
        </div>
      ) : (
        <div>No user info found.</div>
      )}

      <h2 className="academic-title" style={{ marginTop: "2rem" }}>
        Study Groups
      </h2>

      {studyGroups.length === 0 ? (
        <p>No study groups found for your year and branch.</p>
      ) : (
        studyGroups.map((group, index) => (
          <div className="group-card" key={index}>
            <h3 className="group-subject">{group.subject}</h3>
            <p className="group-topic">{group.topic}</p>
            <div className="member-list">
              <h4>Members:</h4>
              <ul>
                {group.members.map((member, idx) => (
                  <li key={idx}>
                    {member.name} ({member.year}, {member.branch})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}

      <hr style={{ margin: "2rem 0" }} />

      <h2 className="academic-title">Create New Study Group</h2>

      {userInfo && (
        <div className="create-group-form">
          <input
            type="text"
            placeholder="Subject"
            value={newGroup.subject}
            onChange={(e) =>
              setNewGroup({ ...newGroup, subject: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Topic"
            value={newGroup.topic}
            onChange={(e) =>
              setNewGroup({ ...newGroup, topic: e.target.value })
            }
          />
          <button onClick={handleCreateGroup}>Create Group</button>
        </div>
      )}
    </div>
  );
};

export default Academic;
