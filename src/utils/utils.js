// src/utils/utils.js
import { jwtDecode } from "jwt-decode";
import { axiosReq } from "../services/axiosDefaults";
import logger from '../services/loggerService';

export const fetchMoreData = async (resource, setResource) => {
  try {
    logger.debug('Fetching more data', { nextUrl: resource.next });
    const { data } = await axiosReq.get(resource.next);
    setResource((prevResource) => ({
      ...prevResource,
      next: data.next,
      results: data.results.reduce((acc, cur) => {
        return acc.some((accResult) => accResult.id === cur.id)
          ? acc
          : [...acc, cur];
      }, prevResource.results),
    }));
    logger.info('Additional data fetched successfully');
  } catch (err) {
    logger.error('Error fetching more data:', err);
  }
};

export const setTokenTimestamp = (data) => {
  try {
    const refreshTokenTimestamp = jwtDecode(data?.refresh_token).exp;
    localStorage.setItem("refreshTokenTimestamp", refreshTokenTimestamp);
    logger.debug('Token timestamp set');
  } catch (err) {
    logger.error('Error setting token timestamp:', err);
  }
};

export const shouldRefreshToken = () => {
  return !!localStorage.getItem("refreshTokenTimestamp");
};

export const removeTokenTimestamp = () => {
  localStorage.removeItem("refreshTokenTimestamp");
  logger.debug('Token timestamp removed');
};

// Date and time formatting utilities
export const formatDateTime = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const formatDuration = (minutes) => {
  if (!minutes) return '0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

// Format large numbers with commas
export const formatNumber = (number) => {
  if (!number) return '0';
  return new Intl.NumberFormat().format(number);
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (!value || !total) return 0;
  return Math.round((value / total) * 100);
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substr(0, maxLength).trim()}...`;
};

// Group array of objects by key
export const groupBy = (array, key) => {
  return array.reduce((acc, item) => {
    (acc[item[key]] = acc[item[key]] || []).push(item);
    return acc;
  }, {});
};

// Sort array of objects by key
export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    if (direction === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    }
    return a[key] < b[key] ? 1 : -1;
  });
};

// Get unique values from array of objects by key
export const uniqueBy = (array, key) => {
  return Array.from(new Map(array.map(item => [item[key], item])).values());
};

// Create URL query string from object
export const createQueryString = (params) => {
  return Object.entries(params)
    .filter(([_, value]) => value != null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
};

// Parse query string to object
export const parseQueryString = (queryString) => {
  if (!queryString) return {};
  return Object.fromEntries(
    queryString
      .substring(1)
      .split('&')
      .map(param => {
        const [key, value] = param.split('=');
        return [decodeURIComponent(key), decodeURIComponent(value)];
      })
  );
};

// Check if object is empty
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Format file size
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};