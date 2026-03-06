import axios from "axios";

// Production API service with hardcoded Render URLs
const PROD_API_URL = "https://vidyamitra-backend-uprd.onrender.com";
const DEV_API_URL = "http://localhost:8000";

// Detect if we're in production (Render)
const host = window.location.hostname;
const isProduction = host.includes('onrender.com') || host.endsWith('.onrender.com');

const API_BASE_URL = isProduction ? PROD_API_URL : DEV_API_URL;

console.log('🌐 Environment:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');
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
    environment: isProduction ? 'PRODUCTION' : 'DEVELOPMENT',
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
      environment: isProduction ? 'PRODUCTION' : 'DEVELOPMENT',
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
      environment: isProduction ? 'PRODUCTION' : 'DEVELOPMENT',
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

// Export the production-ready API instance
export default api;

// Export the base URL for reference
export { API_BASE_URL, isProduction };
