import { jwtDecode } from 'jwt-decode';

export const setTokenTimestamp = (data) => {
  const refreshTokenTimestamp = jwtDecode(data?.refresh_token).exp;
  localStorage.setItem("refreshTokenTimestamp", refreshTokenTimestamp);
};

export const shouldRefreshToken = () => {
  const refreshTokenTimestamp = localStorage.getItem("refreshTokenTimestamp");
  if (!refreshTokenTimestamp) return false;
  
  const now = Date.now() / 1000;
  return now >= parseInt(refreshTokenTimestamp);
};

export const removeTokenTimestamp = () => {
  localStorage.removeItem("refreshTokenTimestamp");
};