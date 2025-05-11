import React, { useEffect, useState } from "react";
import {
  fetchGroupsForUser,
  fetchPendingRequestsByGroupId,
  fetchUserById,
  acceptJoinRequest,
  declineJoinRequest,
  addStudyGroupMember,
} from "../api";

const getCurrentUserId = () => localStorage.getItem("userId");

const MyGroups = () => {
  const [groups, setGroups] = useState([]);
  const [pendingCounts, setPendingCounts] = useState({});
  const [showRequestsFor, setShowRequestsFor] = useState(null); // groupId
  const [pendingRequests, setPendingRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // requestId being processed

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

        // For each group, fetch pending requests count
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
      } catch (err) {
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };
    loadMyGroups();
  }, []);

  // When bell is clicked, fetch and show requests for that group
  const handleShowRequests = async (groupId) => {
    if (showRequestsFor === groupId) {
      setShowRequestsFor(null);
      setPendingRequests([]);
      return;
    }
    setRequestsLoading(true);
    try {
      const requests = await fetchPendingRequestsByGroupId(groupId);

      // Fetch user info for each request
      const requestsWithNames = await Promise.all(
        requests.map(async (req) => {
          let userName = req.uid || req.userId;
          try {
            const user = await fetchUserById(req.uid || req.userId);
            userName = user.name || user.email || userName;
          } catch {
            // fallback to uid if fetch fails
          }
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

  // Accept or decline a join request
  const handleRequestAction = async (requestId, action, groupId, userId) => {
    setActionLoading(requestId);
    try {
      if (action === "accept") {
        await acceptJoinRequest(requestId);
        // After accepting, add the user as a member
        await addStudyGroupMember(groupId, userId);
      } else if (action === "decline") {
        await declineJoinRequest(requestId);
      }
      // Refresh the pending requests and badge count
      await handleShowRequests(groupId);
      // Also update badge count
      const updatedPending = await fetchPendingRequestsByGroupId(groupId);
      setPendingCounts((prev) => ({
        ...prev,
        [groupId]: updatedPending.length,
      }));
    } catch (err) {
      alert("Failed to process request. Try again.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="container mt-5 text-center">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Groups I'm a Member Of</h2>
      {groups.length === 0 ? (
        <div className="alert alert-info">
          You are not a member of any groups.
        </div>
      ) : (
        <ul className="list-group">
          {groups.map((g) => {
            const groupId = g.groupId || g.id;
            const pending = pendingCounts[groupId] || 0;
            return (
              <li key={groupId} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{g.subject}</strong> – {g.topic} ({g.year}, {g.branch})
                  </div>
                  <div>
                    {/* Bell icon with badge */}
                    <span
                      style={{ position: "relative", marginRight: "12px", cursor: "pointer" }}
                      onClick={() => handleShowRequests(groupId)}
                      title="View pending join requests"
                    >
                      <span role="img" aria-label="pending-requests" style={{ fontSize: "1.5em" }}>
                        🔔
                      </span>
                      {pending > 0 && (
                        <span
                          style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            background: "red",
                            color: "white",
                            borderRadius: "50%",
                            padding: "2px 6px",
                            fontSize: "0.8em",
                          }}
                        >
                          {pending}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                {/* Show requests if this group's bell was clicked */}
                {showRequestsFor === groupId && (
                  <div style={{ marginTop: "10px" }}>
                    {requestsLoading ? (
                      <span>Loading requests...</span>
                    ) : pendingRequests.length === 0 ? (
                      <span>No pending requests.</span>
                    ) : (
                      <ul>
                        {pendingRequests.map((req) => (
                          <li key={req.id || req.requestId} className="mb-2">
                            Name: <strong>{req.userName}</strong>
                            <button
                              className="btn btn-success btn-sm ms-3"
                              disabled={actionLoading === req.id || actionLoading === req.requestId}
                              onClick={() =>
                                handleRequestAction(
                                  req.id || req.requestId,
                                  "accept",
                                  groupId,
                                  req.userId // Pass userId to add as member
                                )
                              }
                            >
                              {actionLoading === req.id || actionLoading === req.requestId
                                ? "Processing..."
                                : "Accept"}
                            </button>
                            <button
                              className="btn btn-danger btn-sm ms-2"
                              disabled={actionLoading === req.id || actionLoading === req.requestId}
                              onClick={() =>
                                handleRequestAction(
                                  req.id || req.requestId,
                                  "decline",
                                  groupId,
                                  req.userId // Pass userId for consistency, not used for decline
                                )
                              }
                            >
                              {actionLoading === req.id || actionLoading === req.requestId
                                ? "Processing..."
                                : "Decline"}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MyGroups;
