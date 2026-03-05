import { apiCall, API_BASE_URL } from "./apiEnhanced";

interface AuthPayload {
  username: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

export async function registerUser(payload: AuthPayload): Promise<AuthResponse> {
  try {
    console.log('🔐 Registering user:', payload.username);
    const url = '/auth/register';
    const fullUrl = `${API_BASE_URL}${url}`;
    console.log('🌐 Full registration URL:', fullUrl);
    
    const { data } = await apiCall.post(url, payload);
    console.log('✅ Registration successful:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Registration failed:', error);
    throw error;
  }
}

export async function loginUser(payload: AuthPayload): Promise<AuthResponse> {
  try {
    console.log('🔐 Logging in user:', payload.username);
    const url = '/auth/login';
    const fullUrl = `${API_BASE_URL}${url}`;
    console.log('🌐 Full login URL:', fullUrl);
    
    const { data } = await apiCall.post(url, payload);
    console.log('✅ Login successful:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Login failed:', error);
    throw error;
  }
}

// Test function to verify API connectivity
export async function testApiConnection(): Promise<boolean> {
  try {
    console.log('🔍 Testing API connection...');
    const response = await apiCall.get('/');
    console.log('✅ API connection test successful:', response.data);
    return true;
  } catch (error: any) {
    console.error('❌ API connection test failed:', error);
    return false;
  }
}
