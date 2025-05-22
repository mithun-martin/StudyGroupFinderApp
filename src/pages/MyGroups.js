import React, { useEffect, useState } from "react";
import {
  fetchGroupsForUser,
  fetchPendingRequestsByGroupId,
  fetchUserById,
  acceptJoinRequest,
  declineJoinRequest,
  addStudyGroupMember,
} from "../api";
import './MyGroups.css';

const getCurrentUserId = () => localStorage.getItem("userId");

const MyGroups = () => {
  const [groups, setGroups] = useState([]);
  const [pendingCounts, setPendingCounts] = useState({});
  const [showRequestsFor, setShowRequestsFor] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const loadMyGroups = async () => {
      const userId = getCurrentUserId();
      if (!userId) {
        setGroups([]);
        setLoading(false);
        return;
      }
      try {
        const myGroups = await fetchGroupsForUser(userId);
        setGroups(myGroups);

        const counts = {};
        await Promise.all(
          myGroups.map(async (group) => {
            try {
              const pending = await fetchPendingRequestsByGroupId(group.groupId || group.id);
              counts[group.groupId || group.id] = pending.length;
            } catch {
              counts[group.groupId || group.id] = 0;
            }
          })
        );
        setPendingCounts(counts);
      } catch {
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };
    loadMyGroups();
  }, []);

  const handleShowRequests = async (groupId) => {
    if (showRequestsFor === groupId) {
      setShowRequestsFor(null);
      setPendingRequests([]);
      return;
    }
    setRequestsLoading(true);
    try {
      const requests = await fetchPendingRequestsByGroupId(groupId);

      const requestsWithNames = await Promise.all(
        requests.map(async (req) => {
          let userName = req.uid || req.userId;
          try {
            const user = await fetchUserById(req.uid || req.userId);
            userName = user.name || user.email || userName;
          } catch {}
          return { ...req, userName, userId: req.uid || req.userId };
        })
      );

      setPendingRequests(requestsWithNames);
      setShowRequestsFor(groupId);
    } catch {
      setPendingRequests([]);
      setShowRequestsFor(groupId);
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action, groupId, userId) => {
    setActionLoading(requestId);
    try {
      if (action === "accept") {
        await acceptJoinRequest(requestId);
        await addStudyGroupMember(groupId, userId);
      } else if (action === "decline") {
        await declineJoinRequest(requestId);
      }
      await handleShowRequests(groupId);
      const updatedPending = await fetchPendingRequestsByGroupId(groupId);
      setPendingCounts((prev) => ({
        ...prev,
        [groupId]: updatedPending.length,
      }));
    } catch {
      alert("Failed to process request. Try again.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="mygroups-container">
      <h2 className="mygroups-header">Groups I'm a Member Of</h2>
      {groups.length === 0 ? (
        <div className="no-groups">You are not a member of any groups.</div>
      ) : (
        <div className="groups-list">
          {groups.map((g) => {
            const groupId = g.groupId || g.id;
            const pending = pendingCounts[groupId] || 0;
            return (
              <div key={groupId} className="group-card">
  <div className="group-header">
    <div className="group-title"><strong>Subject:</strong> { g.subject }</div>
    <div><strong>Topic: </strong> { g.topic }</div>
    <div><strong>Year:</strong> { g.year }</div>
    <div><strong>Branch:</strong> { g.branch }</div>
    <button
      className="bell-button"
      onClick={() => handleShowRequests(groupId)}
      title="View pending join requests"
    >
      🔔
      {pending > 0 && <span className="badge">{pending}</span>}
    </button>
  </div>

  {showRequestsFor === groupId && (
    <div className="requests-container">
      {requestsLoading ? (
        <div>Loading requests...</div>
      ) : pendingRequests.length === 0 ? (
        <div>No pending requests.</div>
      ) : (
        <ul className="requests-list">
          {pendingRequests.map((req) => (
            <li key={req.id || req.requestId} className="request-item">
              <span className="request-username">
                <strong>{req.userName}</strong>
              </span>
              <div className="request-actions">
                <button
                  className="accept-btn"
                  disabled={actionLoading === req.id || actionLoading === req.requestId}
                  onClick={() =>
                    handleRequestAction(
                      req.id || req.requestId,
                      "accept",
                      groupId,
                      req.userId
                    )
                  }
                  title="Accept"
                >
                  {actionLoading === req.id || actionLoading === req.requestId
                    ? "..."
                    : "✔️"}
                </button>
                <button
                  className="decline-btn"
                  disabled={actionLoading === req.id || actionLoading === req.requestId}
                  onClick={() =>
                    handleRequestAction(
                      req.id || req.requestId,
                      "decline",
                      groupId,
                      req.userId
                    )
                  }
                  title="Decline"
                >
                  {actionLoading === req.id || actionLoading === req.requestId
                    ? "..."
                    : "❌"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )}
</div>
  );
          })}
        </div>
      )}
    </div>
  );
};

export default MyGroups;
