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
  const response = await axios.post(
    `http://localhost:8080/api/group-requests?groupId=${groupId}&uid=${userId}`
  );
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
export const fetchGroupMembers = async (groupId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/group-members/group/${groupId}`
    );
    return response.data; // Array of StudyGroupMember objects
  } catch (error) {
    console.error("Error fetching group members:", error);
    return [];
  }
};
export const fetchMyGroups = async (uid) => {
  try {
    const response = await axios.get(`${API_URL}/users/user/${uid}/groups`);
    return response.data;
  } catch (error) {
    console.error("Error fetching my groups:", error);
    throw error;
  }
};
export const registerUser = async ({ firebaseUid, email, name, year, branch }) => {
  const response = await axios.post(`${API_URL}/users/register`, {
    firebaseUid,
    email,
    name,
    year,
    branch,
  });
  return response.data;
};
export const addStudyGroupMember = async (groupId, userId) => {
  const response = await axios.post(
    `http://localhost:8080/api/group-members/add?groupId=${groupId}&userId=${userId}`
  );
  return response.data;
};
export const fetchGroupMembershipsForUser = async (userId) => {
  const response = await axios.get(`http://localhost:8080/api/group-members/user/${userId}`);
  return response.data; // Expects array of { id, groupId, userId }
};
export const fetchGroupsForUser = async (userId) => {
  const response = await axios.get(`http://localhost:8080/api/group-members/user/${userId}/groups`);
  return response.data; // Returns an array of groups
};
export const fetchPendingRequestsByGroupId = async (groupId) => {
  const response = await axios.get(
    `http://localhost:8080/api/group-requests/pending?groupId=${groupId}`
  );
  return response.data; // Array of JoinRequest objects
};
export const fetchUserById = async (userId) => {
  const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
  return response.data; // Returns the User object
};
// Accept a join request
export const acceptJoinRequest = async (requestId) => {
  const response = await axios.put(
    `http://localhost:8080/api/group-requests/${requestId}/accept`
  );
  return response.data;
};

// Decline a join request
export const declineJoinRequest = async (requestId) => {
  const response = await axios.put(
    `http://localhost:8080/api/group-requests/${requestId}/decline`
  );
  return response.data;
};
