// Simple auth service with hardcoded production API
const PROD_API_URL = "https://vidyamitra-backend-uprd.onrender.com";

interface AuthPayload {
  username: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

export async function loginUser(payload: AuthPayload): Promise<AuthResponse> {
  try {
    console.log('🔐 Simple Login - User:', payload.username);
    const loginUrl = `${PROD_API_URL}/auth/login`;
    console.log('🌐 Simple Login URL:', loginUrl);
    
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    console.log('📡 Simple Login Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Simple Login Error:', errorData);
      throw new Error(errorData.detail || 'Login failed');
    }
    
    const data = await response.json();
    console.log('✅ Simple Login Success:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Simple Login Failed:', error);
    throw error;
  }
}

export async function registerUser(payload: AuthPayload): Promise<AuthResponse> {
  try {
    console.log('🔐 Simple Register - User:', payload.username);
    const registerUrl = `${PROD_API_URL}/auth/register`;
    console.log('🌐 Simple Register URL:', registerUrl);
    
    const response = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    console.log('📡 Simple Register Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Simple Register Error:', errorData);
      throw new Error(errorData.detail || 'Registration failed');
    }
    
    const data = await response.json();
    console.log('✅ Simple Register Success:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Simple Register Failed:', error);
    throw error;
  }
}
