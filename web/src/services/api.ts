import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("vm_token");
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication failed - clearing invalid token');
      // Clear invalid tokens
      localStorage.removeItem("vm_token");
      localStorage.removeItem("vm_user_email");
      localStorage.removeItem("vm_last_role");
      sessionStorage.removeItem("vm_token");
      sessionStorage.removeItem("vm_user_email");
      sessionStorage.removeItem("vm_last_role");
      
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

