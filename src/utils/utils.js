import { jwtDecode } from 'jwt-decode';

export const setTokenTimestamp = (data) => {
  const refreshTokenTimestamp = jwtDecode(data?.refresh_token).exp;
  localStorage.setItem("refreshTokenTimestamp", refreshTokenTimestamp);
};

export const shouldRefreshToken = () => {
  const refreshTokenTimestamp = localStorage.getItem("refreshTokenTimestamp");
  if (!refreshTokenTimestamp) return false;
  
  const now = Date.now();
  const shouldRefresh = now >= parseInt(refreshTokenTimestamp) * 1000;
  return shouldRefresh;
};

export const removeTokenTimestamp = () => {
  localStorage.removeItem("refreshTokenTimestamp");
};