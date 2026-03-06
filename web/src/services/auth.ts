import api from "./apiDirect";

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
    const fullUrl = `https://vidyamitra-backend-uprd.onrender.com${url}`;
    console.log('🌐 Full registration URL:', fullUrl);
    
    const { data } = await api.post(url, payload);
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
    const fullUrl = `https://vidyamitra-backend-uprd.onrender.com${url}`;
    console.log('🌐 Full login URL:', fullUrl);
    
    const { data } = await api.post(url, payload);
    console.log('✅ Login successful:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Login failed:', error);
    throw error;
  }
}

