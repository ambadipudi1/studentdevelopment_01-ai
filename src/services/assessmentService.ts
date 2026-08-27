import { request } from './api.ts';
import type { Assessment } from '../types/index.ts';

export const assessmentService = {
  async generateAssessment(assessmentType?: string, count?: number): Promise<{ assessment: Assessment }> {
    return request<{ assessment: Assessment }>('/assessment/generate', {
      method: 'POST',
      body: JSON.stringify({ assessmentType, count }),
    });
  },

  async submitAssessment(
    questions: any[],
    answers: Record<string, string>,
    assessmentType?: string
  ): Promise<{ assessment: Assessment }> {
    return request<{ assessment: Assessment }>('/assessment/submit', {
      method: 'POST',
      body: JSON.stringify({ questions, answers, assessmentType }),
    });
  },

  async getHistory(): Promise<{ history: Assessment[] }> {
    return request<{ history: Assessment[] }>('/assessment/history');
  }
};
