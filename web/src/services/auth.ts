import api from "./api";

interface AuthPayload {
  username: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

export async function registerUser(payload: AuthPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);
  return data;
}

export async function loginUser(payload: AuthPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  return data;
}

