import axios from "axios";

const API_URL = "http://localhost:8080/api"; // Replace with your API URL

export const fetchStudyGroups = async () => {
  const response = await axios.get(`${API_URL}/study-groups/all`);
  return response.data;
};

export const createStudyGroup = async (formData) => {
  const response = await axios.post(`${API_URL}/study-groups/create`, formData);
  return response.data;
};

// Add this function to handle the join request
export const sendJoinRequest = async (groupId, userId) => {
  const response = await axios.post(`${API_URL}/group-requests`, {
    groupId,
    userId,
  });
  return response.data;
};

export const fetchGroupRequests = async (groupId) => {
  try {
    const response = await axios.get(
      `${API_URL}/group-requests?groupId=${groupId}`
    );
    return response.data; // Returns the list of requests
  } catch (error) {
    console.error("Error fetching group requests:", error);
    throw error; // Propagate the error
  }
};

// Accept a group join request
export const acceptGroupRequest = async (requestId) => {
  try {
    const response = await axios.post(
      `${API_URL}/group-requests/${requestId}/accept`
    );
    return response;
  } catch (error) {
    console.error("Error accepting request:", error);
    throw error;
  }
};

// Decline a group join request
export const declineGroupRequest = async (requestId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/group-requests/${requestId}`
    );
    return response;
  } catch (error) {
    console.error("Error declining request:", error);
    throw error;
  }
};
