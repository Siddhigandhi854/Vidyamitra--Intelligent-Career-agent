import axios from "axios";

// Enhanced API service with full URL support and debugging
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

console.log('🌐 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor with enhanced debugging
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("vm_token");
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Enhanced debugging
  const fullUrl = `${config.baseURL || API_BASE_URL}${config.url || ''}`;
  console.log('🔍 API Request:', {
    method: config.method?.toUpperCase(),
    url: config.url,
    fullUrl: fullUrl,
    baseURL: config.baseURL || API_BASE_URL,
    headers: {
      ...config.headers,
      Authorization: config.headers.Authorization ? '[REDACTED]' : 'None'
    },
    data: config.data,
    timestamp: new Date().toISOString()
  });
  
  return config;
});

// Response interceptor with enhanced debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      fullUrl: `${response.config.baseURL || API_BASE_URL}${response.config.url || ''}`,
      data: response.data,
      timestamp: new Date().toISOString()
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      fullUrl: `${error.config?.baseURL || API_BASE_URL}${error.config?.url || ''}`,
      message: error.message,
      data: error.response?.data,
      timestamp: new Date().toISOString()
    });
    
    // Handle 401 errors
    if (error.response?.status === 401) {
      console.error('🔐 Authentication failed - clearing invalid token');
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

// Helper function to make API calls with full URL
export const apiCall = {
  get: (url: string, config?: any) => {
    console.log('📡 Making GET request to:', url);
    return api.get(url, config);
  },
  post: (url: string, data?: any, config?: any) => {
    console.log('📤 Making POST request to:', url);
    return api.post(url, data, config);
  },
  put: (url: string, data?: any, config?: any) => {
    console.log('📝 Making PUT request to:', url);
    return api.put(url, data, config);
  },
  delete: (url: string, config?: any) => {
    console.log('🗑️ Making DELETE request to:', url);
    return api.delete(url, config);
  }
};

// Export the default api instance
export default api;

// Export the base URL for reference
export { API_BASE_URL };
