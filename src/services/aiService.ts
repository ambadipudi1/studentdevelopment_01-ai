import { request } from './api.ts';
import type {
  ChatMessage,
  CareerRecommendation,
  SkillGapAnalysis,
  Roadmap,
  StudyPlan,
  Project,
  ProjectGuidanceDetails,
  InterviewSession,
  ProgressAnalysis
} from '../types/index.ts';

export const aiService = {
  // Chat with Student Learning & Career Agent
  async sendChatMessage(message: string): Promise<{ message: ChatMessage; history: ChatMessage[] }> {
    return request<{ message: ChatMessage; history: ChatMessage[] }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  async getChatHistory(): Promise<{ messages: ChatMessage[] }> {
    return request<{ messages: ChatMessage[] }>('/ai/chat-history');
  },

  // Career Recommendation
  async generateCareerRecommendation(): Promise<{ recommendation: CareerRecommendation }> {
    return request<{ recommendation: CareerRecommendation }>('/ai/career-recommendation', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  async getCareerRecommendation(): Promise<{ recommendation: CareerRecommendation | null }> {
    return request<{ recommendation: CareerRecommendation | null }>('/ai/career-recommendation');
  },

  // Skill Gap
  async analyzeSkillGap(targetRole?: string): Promise<{ analysis: SkillGapAnalysis }> {
    return request<{ analysis: SkillGapAnalysis }>('/ai/skill-gap', {
      method: 'POST',
      body: JSON.stringify({ targetRole }),
    });
  },

  // Roadmap
  async generateRoadmap(targetRole?: string): Promise<{ roadmap: Roadmap }> {
    return request<{ roadmap: Roadmap }>('/ai/roadmap', {
      method: 'POST',
      body: JSON.stringify({ targetRole }),
    });
  },

  async getRoadmap(): Promise<{ roadmap: Roadmap | null }> {
    return request<{ roadmap: Roadmap | null }>('/ai/roadmap');
  },

  // Study Plan
  async generateStudyPlan(): Promise<{ studyPlan: StudyPlan }> {
    return request<{ studyPlan: StudyPlan }>('/ai/study-plan', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  async getStudyPlan(): Promise<{ studyPlan: StudyPlan | null }> {
    return request<{ studyPlan: StudyPlan | null }>('/ai/study-plan');
  },

  async toggleStudyTask(taskId: string): Promise<{ studyPlan: StudyPlan }> {
    return request<{ studyPlan: StudyPlan }>('/study-plan/toggle-task', {
      method: 'POST',
      body: JSON.stringify({ taskId }),
    });
  },

  // Projects
  async generateProjects(difficulty?: string): Promise<{ projects: Project[] }> {
    return request<{ projects: Project[] }>('/ai/projects', {
      method: 'POST',
      body: JSON.stringify({ difficulty }),
    });
  },

  async getProjects(): Promise<{ projects: Project[] }> {
    return request<{ projects: Project[] }>('/ai/projects');
  },

  async getProjectGuidance(projectId: string): Promise<{ guidance: ProjectGuidanceDetails }> {
    return request<{ guidance: ProjectGuidanceDetails }>('/ai/project-guidance', {
      method: 'POST',
      body: JSON.stringify({ projectId }),
    });
  },

  async updateProjectStatus(projectId: string, status: 'Not Started' | 'In Progress' | 'Completed'): Promise<{ project: Project }> {
    return request<{ project: Project }>(`/projects/${projectId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Interview Preparation
  async startInterview(role: string, difficulty: string, topic: string, count = 3): Promise<{ session: InterviewSession }> {
    return request<{ session: InterviewSession }>('/ai/interview', {
      method: 'POST',
      body: JSON.stringify({ role, difficulty, topic, count }),
    });
  },

  async evaluateInterviewAnswer(payload: {
    sessionId: string;
    questionId: number;
    answer: string;
    role: string;
    difficulty: string;
    questionText: string;
  }): Promise<{ evaluation: any }> {
    return request<{ evaluation: any }>('/ai/interview-evaluate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getInterviewHistory(): Promise<{ history: InterviewSession[] }> {
    return request<{ history: InterviewSession[] }>('/ai/interview-history');
  },

  // Progress Analysis
  async analyzeProgress(): Promise<{ analysis: ProgressAnalysis }> {
    return request<{ analysis: ProgressAnalysis }>('/ai/progress-analysis', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }
};
