import axios from "axios";

// Direct API service with hardcoded production URL
const API_BASE_URL = "https://vidyamitra-backend-uprd.onrender.com";

console.log('🌐 Using Direct API Service');
console.log('🌐 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("vm_token");
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  
  const fullUrl = `${API_BASE_URL}${config.url || ''}`;
  console.log('🔍 Direct API Request:', {
    method: config.method?.toUpperCase(),
    url: config.url,
    fullUrl: fullUrl,
    baseURL: API_BASE_URL,
    headers: {
      ...config.headers,
      Authorization: config.headers.Authorization ? '[REDACTED]' : 'None'
    },
    data: config.data,
    timestamp: new Date().toISOString()
  });
  
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ Direct API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      fullUrl: `${API_BASE_URL}${response.config.url || ''}`,
      data: response.data,
      timestamp: new Date().toISOString()
    });
    return response;
  },
  (error) => {
    console.error('❌ Direct API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      fullUrl: `${API_BASE_URL}${error.config?.url || ''}`,
      message: error.message,
      data: error.response?.data,
      timestamp: new Date().toISOString()
    });
    
    if (error.response?.status === 401) {
      console.error('🔐 Authentication failed - clearing invalid token');
      localStorage.removeItem("vm_token");
      localStorage.removeItem("vm_user_email");
      localStorage.removeItem("vm_last_role");
      sessionStorage.removeItem("vm_token");
      sessionStorage.removeItem("vm_user_email");
      sessionStorage.removeItem("vm_last_role");
      
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
