export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  college: string;
  education?: string;
  degree: string;
  branch: string;
  year_of_study?: string;
  graduation_year?: number | string;
  cgpa: number | string;
  percentage?: string;
  experience_level: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  interests: string[];
  career_goal?: string;
  target_role: string;
  target_companies?: string;
  available_hours_per_day?: number;
  available_study_time?: string;
  learning_style?: string;
  preferred_learning_style?: string;
  preferred_language?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AssessmentQuestion {
  id: number;
  question: string;
  type?: 'multiple_choice' | 'technical' | 'conceptual' | 'scenario';
  options?: any;
  correct_answer?: string;
  explanation?: string;
  topic?: string;
}

export interface Assessment {
  id: string;
  user_id: string;
  assessment_type: string;
  target_role?: string;
  questions: AssessmentQuestion[];
  answers?: Record<string, string>;
  score: number;
  total_questions: number;
  strengths: string[];
  weaknesses: string[];
  missing_concepts?: string[];
  recommended_topics: string[];
  feedback?: string;
  created_at: string;
}

export interface AlternativeCareerPath {
  title?: string;
  role?: string;
  fit_score?: number;
  match_percentage?: number;
  description?: string;
  why_fit?: string;
  key_skills?: string[];
  transition_difficulty?: 'Easy' | 'Moderate' | 'Challenging';
}

export interface CareerRecommendation {
  id: string;
  user_id: string;
  recommended_role: string;
  career_paths: AlternativeCareerPath[];
  reasoning: string;
  required_skills: string[];
  existing_skills: string[];
  missing_skills: string[];
  next_steps: string[];
  market_demand?: string;
  salary_range?: string;
  created_at: string;
}

export interface PrioritizedSkillItem {
  priority: number;
  skill: string;
  current_level: string;
  target_level: string;
  estimated_hours: number;
  recommended_action: string;
}

export interface SkillGapItem {
  skill: string;
  status: 'Strong' | 'Intermediate' | 'Beginner' | 'Missing';
  priority: 'High' | 'Medium' | 'Low';
  category?: string;
  learning_order?: number;
  estimated_hours?: number;
  description?: string;
}

export interface SkillGapAnalysis {
  target_role: string;
  overall_match_percentage?: number;
  match_score?: number;
  estimated_hours_to_bridge?: number;
  skills?: SkillGapItem[];
  strong_skills: string[];
  moderate_skills?: string[];
  intermediate_skills?: string[];
  weak_skills?: string[];
  beginner_skills?: string[];
  missing_skills: string[];
  prioritized_learning_order?: PrioritizedSkillItem[];
  recommended_learning_order?: string[];
  summary?: string;
  created_at?: string;
}

export interface RoadmapMilestone {
  phase_number?: number;
  phase?: number;
  title: string;
  estimated_duration?: string;
  duration?: string;
  description: string;
  topics: string[];
  hands_on_project?: string;
  practical_projects?: string[];
  learning_outcomes: string[];
  completed?: boolean;
}

export interface Roadmap {
  id: string;
  user_id: string;
  title?: string;
  target_role: string;
  total_duration?: string;
  duration?: string;
  phases?: RoadmapMilestone[];
  stages?: RoadmapMilestone[];
  created_at?: string;
  updated_at?: string;
}

export interface DailyStudyTask {
  id: string;
  day: string;
  focus?: string;
  topic?: string;
  duration_hours?: number;
  duration_minutes?: number;
  action_items?: string[];
  task_type?: 'Concept' | 'Practice' | 'Project' | 'Revision';
  description?: string;
  completed: boolean;
}

export interface WeeklyStudyPlan {
  week_number: number;
  theme?: string;
  focus?: string;
  weekly_goal?: string;
  daily_tasks: DailyStudyTask[];
}

export interface StudyPlan {
  id: string;
  user_id: string;
  total_weeks?: number;
  duration?: string;
  hours_per_day?: number;
  daily_hours?: string;
  weekly_plan: WeeklyStudyPlan[];
  completed_items: string[];
  monthly_goals?: string[];
  tips?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ProjectGuidanceDetails {
  architecture_overview: string;
  folder_structure: string;
  dependencies?: string[];
  database_schema?: string;
  database_design?: string;
  api_design?: string;
  frontend_structure?: string;
  backend_structure?: string;
  step_by_step_guide: any[];
  testing_debugging_tips?: string[];
  deployment_guide?: string;
  resume_bullets?: string[];
  resume_bullet_points?: string[];
}

export interface ProjectMilestone {
  title: string;
  deliverables: string[];
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  problem_statement?: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tech_stack?: string[];
  technologies?: string[];
  estimated_time?: string;
  prerequisites?: string[];
  features?: string[];
  development_steps?: string[];
  milestones?: ProjectMilestone[];
  expected_outcome?: string;
  resume_impact?: string;
  resume_value?: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  guidance?: ProjectGuidanceDetails;
  created_at?: string;
  updated_at?: string;
}

export interface ProgressData {
  id?: string;
  user_id: string;
  overall_readiness: number;
  completed_topics: string[];
  completed_projects: string[];
  assessment_average_score: number;
  interview_average_score: number;
  study_streak_days: number;
  total_study_hours: number;
  skills_mastery: { skill: string; percentage: number; level: string }[];
  recent_activity: { type: string; title: string; date: string; score?: number }[];
  updated_at: string;
}

export interface ProgressAnalysis {
  readiness_score?: number;
  overall_summary?: string;
  strengths: string[];
  key_strengths?: string[];
  weaknesses: string[];
  improvements: string[];
  improvement_areas?: string[];
  next_milestones?: string[];
  next_topic?: string;
  recommended_project?: string;
  study_adjustment?: string;
  motivational_insight?: string;
  readiness_status?: string;
  created_at?: string;
}

export interface InterviewQuestionItem {
  id: number;
  question: string;
  category?: string;
  type?: 'Technical' | 'HR' | 'Behavioral' | 'Project' | 'Scenario';
  topic?: string;
  user_answer?: string;
  score?: number;
  feedback?: string;
  model_answer?: string;
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
}

export type InterviewQuestion = InterviewQuestionItem;

export interface InterviewSession {
  id: string;
  user_id: string;
  role: string;
  difficulty: string;
  topic: string;
  questions: InterviewQuestionItem[];
  overall_score?: number;
  overall_feedback?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: string;
  suggestions?: string[];
}
