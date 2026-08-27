import { request } from './api.ts';
import type { ProgressData } from '../types/index.ts';

export const progressService = {
  async getProgress(): Promise<{ progress: ProgressData }> {
    return request<{ progress: ProgressData }>('/progress');
  },

  async getSystemStatus(): Promise<{
    status: string;
    gemini_api_configured: boolean;
    gemini_model: string;
    agent: string;
  }> {
    return request<{
      status: string;
      gemini_api_configured: boolean;
      gemini_model: string;
      agent: string;
    }>('/system/status');
  }
};
