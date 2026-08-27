import { request } from './api.ts';
import type { StudentProfile } from '../types/index.ts';

export const profileService = {
  async getProfile(): Promise<{ profile: StudentProfile | null }> {
    return request<{ profile: StudentProfile | null }>('/profile');
  },

  async saveProfile(profileData: Partial<StudentProfile>): Promise<{ profile: StudentProfile }> {
    return request<{ profile: StudentProfile }>('/profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  },

  async updateProfile(profileData: Partial<StudentProfile>): Promise<{ profile: StudentProfile }> {
    return request<{ profile: StudentProfile }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  async deleteProfile(): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>('/profile', {
      method: 'DELETE',
    });
  }
};
