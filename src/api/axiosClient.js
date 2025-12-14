import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// attach token automatically
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// unwrap data and handle 401 centrally
axiosClient.interceptors.response.use(
  (response) => response, // return full response so callers can inspect headers if needed
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optionally handle logout
      // localStorage.removeItem('authToken');
      // window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
