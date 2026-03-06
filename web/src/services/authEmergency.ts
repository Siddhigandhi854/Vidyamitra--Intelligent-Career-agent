// Emergency auth fix - dynamic backend selection
const host = window.location.hostname;
const isLocal = host === 'localhost' || host === '127.0.0.1';
const BACKEND_URL = isLocal ? "http://127.0.0.1:8000" : "https://vidyamitra-backend-uprd.onrender.com";

export async function loginUser(username: string, password: string) {
  try {
    console.log('🚨 EMERGENCY LOGIN ATTEMPT');
    console.log('🚨 User:', username);
    console.log('🚨 Backend URL:', BACKEND_URL);
    
    const loginUrl = `${BACKEND_URL}/auth/login`;
    console.log('🚨 Full URL:', loginUrl);
    
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    
    console.log('🚨 Response Status:', response.status);
    console.log('🚨 Response OK:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('🚨 ERROR RESPONSE:', errorText);
      throw new Error(`Login failed: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('🚨 SUCCESS RESPONSE:', data);
    
    // Store token
    localStorage.setItem('vm_token', data.access_token);
    localStorage.setItem('vm_user_email', username);
    
    return data;
  } catch (error) {
    console.error('🚨 CATCH ERROR:', error);
    throw error;
  }
}

export async function registerUser(username: string, password: string) {
  try {
    console.log('🚨 EMERGENCY REGISTER ATTEMPT');
    console.log('🚨 User:', username);
    
    const registerUrl = `${BACKEND_URL}/auth/register`;
    console.log('🚨 Register URL:', registerUrl);
    
    const response = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    
    console.log('🚨 Register Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('🚨 REGISTER ERROR:', errorText);
      throw new Error(`Registration failed: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('🚨 REGISTER SUCCESS:', data);
    
    // Store token
    localStorage.setItem('vm_token', data.access_token);
    localStorage.setItem('vm_user_email', username);
    
    return data;
  } catch (error) {
    console.error('🚨 REGISTER CATCH ERROR:', error);
    throw error;
  }
}
