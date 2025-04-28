import React, { useState, useEffect } from "react";
import {
  fetchGroupRequests,
  acceptGroupRequest,
  declineGroupRequest,
} from "../api"; // Assuming you have a function to fetch group requests

const MyRequests = ({ groupId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch join requests for the group using the groupId
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetchGroupRequests(groupId); // Call the function from api.js
        setRequests(response.data); // Assuming your API returns the data in a proper format
      } catch (error) {
        console.error("Error fetching group requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [groupId]);

  // Handle accepting or declining requests (assuming you have the functions in api.js)
  const handleAccept = async (requestId) => {
    try {
      await acceptGroupRequest(requestId); // Call API to accept request
      alert("Request accepted!");
      // Optionally, re-fetch the requests after accepting
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await declineGroupRequest(requestId); // Call API to decline request
      alert("Request declined!");
      // Optionally, re-fetch the requests after declining
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  if (loading) {
    return <p>Loading requests...</p>;
  }

  return (
    <div className="my-requests-container">
      <h3>Pending Join Requests</h3>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul>
          {requests.map((request) => (
            <li key={request.id}>
              <p>
                <strong>{request.user.name}</strong> ({request.user.email})
              </p>
              <button onClick={() => handleAccept(request.id)}>
                Accept ✅
              </button>
              <button onClick={() => handleDecline(request.id)}>
                Decline ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyRequests;
