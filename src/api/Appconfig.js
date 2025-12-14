// constants.js hoặc apiConfig.js
export const API_BASE = 'http://localhost:8081/api';

export const getAuthToken = () => localStorage.getItem('authToken') || '';

export const getHeaders = (isMultipart = false) => {
  const token = getAuthToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  // Nếu là Multipart (gửi file) thì KHÔNG được set Content-Type thủ công, để browser tự lo
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};