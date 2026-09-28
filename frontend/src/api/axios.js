import axios from 'axios';

// One axios instance for the whole app.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach the saved JWT to every outgoing request.
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('booksWorldUser');
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Turn any backend error into a plain readable string.
export const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || 'Something went wrong. Try again.';

export default api;
