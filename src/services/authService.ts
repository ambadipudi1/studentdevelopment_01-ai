import { request, setAuthToken } from './api.ts';
import type { User, StudentProfile } from '../types/index.ts';

export interface AuthResponse {
  user: User;
  token: string;
  profile: StudentProfile | null;
}

export const authService = {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const data = await request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    if (data.token) setAuthToken(data.token);
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) setAuthToken(data.token);
    return data;
  },

  async getMe(): Promise<{ user: User; profile: StudentProfile | null }> {
    return request<{ user: User; profile: StudentProfile | null }>('/auth/me');
  },

  logout() {
    setAuthToken(null);
  }
};
