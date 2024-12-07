import { jwtDecode } from "jwt-decode";

export const setTokenTimestamp = (data) => {
  try {
    if (data?.access) {
      // Decode the access token
      const token = jwtDecode(data.access);
      // Store the token's expiration timestamp
      localStorage.setItem("refreshTokenTimestamp", token.exp);
    }
  } catch (err) {
    console.error('Error setting token timestamp:', err);
    // Remove the timestamp if there's an error
    removeTokenTimestamp();
  }
};

export const shouldRefreshToken = () => {
  const timestamp = localStorage.getItem("refreshTokenTimestamp");
  if (!timestamp) return false;
  
  const now = Date.now() / 1000; // Convert to seconds
  return now >= parseInt(timestamp);
};

export const removeTokenTimestamp = () => {
  localStorage.removeItem("refreshTokenTimestamp");
};