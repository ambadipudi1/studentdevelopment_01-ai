import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type {
  User,
  StudentProfile,
  Assessment,
  CareerRecommendation,
  Roadmap,
  StudyPlan,
  Project,
  ProgressData,
  InterviewSession,
  ChatMessage
} from '../src/types/index.ts';

const DB_FILE = path.join(process.cwd(), 'studentpath_data.json');

export interface DatabaseSchema {
  users: (User & { password_hash: string })[];
  profiles: StudentProfile[];
  assessments: Assessment[];
  career_recommendations: CareerRecommendation[];
  roadmaps: Roadmap[];
  study_plans: StudyPlan[];
  projects: Project[];
  progress: ProgressData[];
  interview_sessions: InterviewSession[];
  chat_histories: { user_id: string; messages: ChatMessage[] }[];
}

// Simple deterministic hash for demo passwords
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'studentpath_salt').digest('hex');
}

export function generateToken(userId: string): string {
  const payload = Buffer.from(JSON.stringify({ userId, exp: Date.now() + 24 * 60 * 60 * 1000 })).toString('base64');
  const signature = crypto.createHmac('sha256', 'studentpath_jwt_secret').update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export function verifyToken(token: string): string | null {
  try {
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;
    const expectedSignature = crypto.createHmac('sha256', 'studentpath_jwt_secret').update(payload).digest('hex');
    if (signature !== expectedSignature) return null;
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    if (decoded.exp < Date.now()) return null;
    return decoded.userId;
  } catch {
    return null;
  }
}

const defaultDemoUserId = 'demo-user-101';
const demoCreatedAt = new Date().toISOString();

const initialDbData: DatabaseSchema = {
  users: [
    {
      id: defaultDemoUserId,
      name: 'Alex Chen',
      email: 'student@studentpath.ai',
      password_hash: hashPassword('password123'),
      created_at: demoCreatedAt,
      updated_at: demoCreatedAt
    }
  ],
  profiles: [
    {
      id: 'profile-1',
      user_id: defaultDemoUserId,
      education: 'Undergraduate',
      degree: 'B.Tech',
      branch: 'Computer Science and Engineering',
      college: 'National Institute of Technology',
      graduation_year: 2026,
      cgpa: '8.7',
      percentage: '87%',
      skills: ['Python', 'SQL', 'JavaScript', 'React', 'Git', 'Data Structures', 'Machine Learning'],
      interests: ['Artificial Intelligence', 'Full Stack Development', 'Machine Learning', 'Cloud Computing'],
      career_goal: 'AI Engineer',
      experience_level: 'Intermediate',
      available_study_time: '2 hours/day',
      preferred_learning_style: 'Project-based',
      preferred_language: 'English',
      target_role: 'AI Engineer',
      created_at: demoCreatedAt,
      updated_at: demoCreatedAt
    }
  ],
  assessments: [
    {
      id: 'assessment-seed-1',
      user_id: defaultDemoUserId,
      assessment_type: 'Full Stack & AI Foundations',
      target_role: 'AI Engineer',
      questions: [
        {
          id: 1,
          question: 'What is the primary difference between Supervised and Unsupervised Learning?',
          type: 'conceptual',
          options: [
            'Supervised uses labeled training data, unsupervised finds patterns in unlabeled data',
            'Supervised learning never uses neural networks',
            'Unsupervised learning requires ground truth outputs',
            'There is no difference in algorithmic structure'
          ],
          correct_answer: 'Supervised uses labeled training data, unsupervised finds patterns in unlabeled data',
          topic: 'Machine Learning Basics'
        }
      ],
      score: 85,
      total_questions: 5,
      strengths: ['Python Syntax', 'SQL Queries', 'Basic Neural Network Concepts', 'Version Control'],
      weaknesses: ['MLOps & Model Deployment', 'Vector Databases', 'Transformers Architecture'],
      missing_concepts: ['Embedding similarity search', 'Model Quantization'],
      recommended_topics: ['LangChain & LLM APIs', 'FastAPI backend integration', 'Vector Indexing with Pinecone/Chroma'],
      feedback: 'Great foundational grasp of core algorithms and relational databases. Ready to advance into transformer fine-tuning and agentic workflows.',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  career_recommendations: [
    {
      id: 'career-rec-1',
      user_id: defaultDemoUserId,
      recommended_role: 'AI Engineer / Applied LLM Specialist',
      career_paths: [
        {
          role: 'Machine Learning Engineer',
          match_percentage: 92,
          why_fit: 'Your Python and ML foundation aligns with model training, evaluation, and pipeline automation.',
          transition_difficulty: 'Easy'
        },
        {
          role: 'Full Stack AI Developer',
          match_percentage: 89,
          why_fit: 'Your React and Python skills enable you to build interactive AI web applications end-to-end.',
          transition_difficulty: 'Easy'
        },
        {
          role: 'Data Scientist',
          match_percentage: 82,
          why_fit: 'Solid SQL and mathematical foundations for predictive modeling and data visualization.',
          transition_difficulty: 'Moderate'
        }
      ],
      reasoning: 'Given your Computer Science background (CGPA 8.7), proficiency in Python, SQL, and React, and target goal of AI Engineer, you are ideally situated to build intelligent software systems combining modern GenAI APIs with robust backend architectures.',
      required_skills: ['Python', 'SQL', 'FastAPI', 'PyTorch / TensorFlow', 'Vector Databases', 'LangChain / GenAI SDKs', 'MLOps', 'Docker'],
      existing_skills: ['Python', 'SQL', 'JavaScript', 'React', 'Git', 'Data Structures', 'Machine Learning'],
      missing_skills: ['Vector Databases', 'LangChain / Google GenAI SDK', 'FastAPI / API Design', 'MLOps / Docker', 'Model Evaluation Frameworks'],
      next_steps: [
        'Build a production RAG application using Gemini API and Vector embeddings',
        'Learn containerization with Docker and deployment to Cloud platforms',
        'Practice algorithmic coding and system design mock interviews'
      ],
      market_demand: 'Extremely High (38% YoY growth in AI & Full Stack AI job openings)',
      salary_range: '$95,000 - $145,000 / year (Entry to Early Mid-Level)',
      created_at: demoCreatedAt
    }
  ],
  roadmaps: [
    {
      id: 'roadmap-1',
      user_id: defaultDemoUserId,
      title: 'Personalized AI Engineer Mastery Roadmap',
      target_role: 'AI Engineer',
      duration: '16 Weeks (4 Months)',
      stages: [
        {
          phase: 1,
          title: 'Advanced Python & Math Foundations',
          duration: 'Weeks 1-3',
          description: 'Solidify asynchronous Python, OOP design patterns, NumPy vectorized computations, and foundational Linear Algebra.',
          topics: ['AsyncIO & Type Hinting', 'NumPy & Pandas performance optimization', 'Calculus & Matrix Operations for ML', 'Clean Code Principles'],
          practical_projects: ['Custom Matrix Operations Engine from scratch', 'High-throughput Data Processing Pipeline'],
          learning_outcomes: ['Write modular, type-safe Python', 'Vectorize data transformations without slow loops'],
          completed: true
        },
        {
          phase: 2,
          title: 'Deep Learning & Neural Architectures',
          duration: 'Weeks 4-7',
          description: 'Deep dive into PyTorch, forward/backward propagation, CNNs, RNNs, and Attention mechanisms.',
          topics: ['PyTorch Tensors & Autograd', 'Loss Functions & Optimizers (Adam, SGD)', 'Transformer Self-Attention & Multi-Head Attention', 'Transfer Learning'],
          practical_projects: ['Image Classifier with PyTorch', 'Custom Mini-Transformer Decoder'],
          learning_outcomes: ['Train and fine-tune models with custom datasets', 'Understand mathematical self-attention mechanics'],
          completed: true
        },
        {
          phase: 3,
          title: 'Generative AI, LLM APIs & Vector Search',
          duration: 'Weeks 8-11',
          description: 'Harness Google Gemini API, embeddings, chunking strategies, Vector databases, and structured JSON output generation.',
          topics: ['Gemini 3.7 Flash & Pro Prompt Engineering', 'Embeddings & Cosine Similarity', 'RAG (Retrieval Augmented Generation) Architecture', 'Function Calling & Structured Outputs'],
          practical_projects: ['Smart Document Q&A with Gemini & Vector Store', 'Automated AI Code Reviewer Bot'],
          learning_outcomes: ['Build low-latency generative applications', 'Prevent hallucinations with dynamic grounded context'],
          completed: false
        },
        {
          phase: 4,
          title: 'Production Full-Stack AI & MLOps',
          duration: 'Weeks 12-14',
          description: 'FastAPI microservices, Docker containerization, rate limiting, caching with Redis, and React UI integration.',
          topics: ['FastAPI asynchronous routing', 'Docker multi-stage builds', 'Monitoring & Tracing AI calls', 'CI/CD pipeline configuration'],
          practical_projects: ['End-to-End Multimodal AI Assistant Platform', 'Containerized Cloud Microservice'],
          learning_outcomes: ['Deploy resilient AI APIs', 'Ship complete full-stack AI products to production'],
          completed: false
        },
        {
          phase: 5,
          title: 'System Design & Technical Interview Prep',
          duration: 'Weeks 15-16',
          description: 'Machine learning system design questions, LeetCode medium algorithms, behavioral STAR framework, and mock interviews.',
          topics: ['ML System Design (Recommendation, Search, Real-time inference)', 'Behavioral Interview STAR Technique', 'Resume polishing and GitHub portfolio showcasing'],
          practical_projects: ['System Design Blueprint for YouTube Recommendation System', 'Complete Portfolio Showcase'],
          learning_outcomes: ['Confidently ace technical and behavioral AI rounds', 'Articulate trade-offs under pressure'],
          completed: false
        }
      ],
      created_at: demoCreatedAt,
      updated_at: demoCreatedAt
    }
  ],
  study_plans: [
    {
      id: 'study-plan-1',
      user_id: defaultDemoUserId,
      duration: '4-Week Sprint',
      daily_hours: '2 hours/day',
      completed_items: ['task-1-1', 'task-1-2', 'task-2-1'],
      weekly_plan: [
        {
          week_number: 1,
          focus: 'Gemini API & Structured Prompts',
          daily_tasks: [
            {
              id: 'task-1-1',
              day: 'Monday',
              topic: 'Gemini 3.7 Flash SDK Setup & Schema Generation',
              duration_minutes: 60,
              task_type: 'Concept',
              description: 'Install @google/genai, configure responseSchema for structured JSON extraction.',
              completed: true
            },
            {
              id: 'task-1-2',
              day: 'Tuesday',
              topic: 'Building System Instructions & Context Injection',
              duration_minutes: 60,
              task_type: 'Practice',
              description: 'Write customized system prompts that anchor role personas and student profile data.',
              completed: true
            },
            {
              id: 'task-1-3',
              day: 'Wednesday',
              topic: 'Function Calling & Tool Integrations',
              duration_minutes: 60,
              task_type: 'Practice',
              description: 'Implement tool declarations for live data retrieval and model execution.',
              completed: false
            },
            {
              id: 'task-1-4',
              day: 'Thursday',
              topic: 'Streaming Responses with Server-Sent Events',
              duration_minutes: 60,
              task_type: 'Concept',
              description: 'Implement real-time token streaming to frontend React clients.',
              completed: false
            },
            {
              id: 'task-1-5',
              day: 'Friday',
              topic: 'Mini-Project: Interactive CLI AI Mentor',
              duration_minutes: 90,
              task_type: 'Project',
              description: 'Build a command-line tool powered by Gemini with conversation history memory.',
              completed: false
            }
          ]
        },
        {
          week_number: 2,
          focus: 'Vector Embeddings & RAG Architecture',
          daily_tasks: [
            {
              id: 'task-2-1',
              day: 'Monday',
              topic: 'Text Embeddings & Vector Similarity Math',
              duration_minutes: 60,
              task_type: 'Concept',
              description: 'Understand high-dimensional vector spaces, dot product, and cosine similarity.',
              completed: true
            },
            {
              id: 'task-2-2',
              day: 'Tuesday',
              topic: 'Document Chunking Strategies',
              duration_minutes: 60,
              task_type: 'Practice',
              description: 'Compare recursive character vs semantic chunking for PDF technical papers.',
              completed: false
            },
            {
              id: 'task-2-3',
              day: 'Wednesday',
              topic: 'Vector Database Integration (Chroma / In-Memory)',
              duration_minutes: 60,
              task_type: 'Practice',
              description: 'Store embeddings, query nearest neighbors, and assemble augmented prompts.',
              completed: false
            },
            {
              id: 'task-2-4',
              day: 'Thursday',
              topic: 'Reranking & Context Compression',
              duration_minutes: 60,
              task_type: 'Concept',
              description: 'Filter irrelevant chunks before prompt injection to maximize accuracy.',
              completed: false
            },
            {
              id: 'task-2-5',
              day: 'Friday',
              topic: 'Mini-Project: Course Notes QA Engine',
              duration_minutes: 90,
              task_type: 'Project',
              description: 'Build a document questioning system with source citation badges.',
              completed: false
            }
          ]
        }
      ],
      monthly_goals: [
        'Complete 12 hands-on coding exercises on GenAI APIs',
        'Ship 2 portfolio-grade AI applications to GitHub',
        'Pass 2 full mock technical interview sessions with >85% score'
      ],
      tips: [
        'Dedicate 45 minutes to focused concept learning, followed by 15 minutes of immediate hands-on coding.',
        'Document tricky bugs and concepts in your notes for weekend spaced repetition.'
      ],
      created_at: demoCreatedAt,
      updated_at: demoCreatedAt
    }
  ],
  projects: [
    {
      id: 'proj-1',
      user_id: defaultDemoUserId,
      title: 'Context-Aware AI Document & Research Companion',
      problem_statement: 'Students and researchers spend hours sifting through dense 50-page academic papers without quick synthesized comprehension or citation lookup.',
      description: 'A full-stack web application that allows users to upload PDF research papers, indexes their sections using vector embeddings, and provides an interactive conversational interface powered by Google Gemini with verbatim source page citations.',
      difficulty: 'Intermediate',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'Google Gemini API', 'Vector DB', 'PyPDF'],
      prerequisites: ['Python intermediate', 'Basic knowledge of REST APIs', 'Familiarity with React hooks'],
      features: [
        'PDF drag-and-drop document ingestion & parsing',
        'Semantic chunking & vector search for high relevance',
        'Gemini 3.7 Flash generation with grounded citations',
        'Exportable study flashcards and key takeaways',
        'Dark/light modern aesthetic with Markdown rendering'
      ],
      development_steps: [
        'Set up FastAPI backend with file upload endpoint and PyPDF extraction',
        'Generate text embeddings and store vectors with metadata',
        'Implement hybrid retrieval endpoint querying Gemini API',
        'Build responsive React frontend with document preview pane',
        'Add citation highlights linking chat answers to exact document snippets'
      ],
      milestones: [
        { title: 'Core Ingestion Engine', deliverables: ['File parsing', 'Text chunker', 'Embedding pipeline'] },
        { title: 'AI Query Endpoint', deliverables: ['FastAPI route', 'Gemini prompt template', 'Source verification'] },
        { title: 'Frontend UI', deliverables: ['Upload UI', 'Chat interface', 'Export summaries'] }
      ],
      expected_outcome: 'A polished, production-ready portfolio project demonstrating modern GenAI and RAG architecture.',
      resume_value: 'Demonstrates end-to-end full-stack capabilities, mastery of Google GenAI SDK, vector databases, and API development.',
      status: 'In Progress',
      created_at: demoCreatedAt,
      updated_at: demoCreatedAt
    },
    {
      id: 'proj-2',
      user_id: defaultDemoUserId,
      title: 'Autonomous Code Reviewer & Bug Explainer',
      problem_statement: 'Junior engineers struggle to get fast, constructive feedback on Git pull requests before merging into production repositories.',
      description: 'An automated developer tool that parses GitHub pull requests, analyzes code diffs using Gemini 3.7 Flash, flags security vulnerabilities, performance bottlenecks, and provides refactored code recommendations with explanations.',
      difficulty: 'Intermediate',
      technologies: ['Node.js / Express', 'TypeScript', 'GitHub Webhooks API', 'Gemini API', 'React'],
      prerequisites: ['Git basics', 'JavaScript/TypeScript', 'HTTP webhooks'],
      features: [
        'Webhook listener for PR opened/synchronized events',
        'Intelligent diff parser isolating changed lines',
        'Gemini security & performance analysis',
        'Automated markdown review comments on GitHub PRs',
        'Web dashboard showing team code quality metrics'
      ],
      development_steps: [
        'Create webhook handler validating GitHub HMAC signatures',
        'Format code diff into structured prompt for Gemini',
        'Extract line-by-line review comments via structured JSON schema',
        'Post comments via GitHub REST API',
        'Display historical analysis in React dashboard'
      ],
      milestones: [
        { title: 'GitHub Integration', deliverables: ['Webhook listener', 'Diff parser'] },
        { title: 'Gemini Review Engine', deliverables: ['Structured prompt', 'Schema validation'] },
        { title: 'Metrics Dashboard', deliverables: ['Review history', 'Vulnerability trends'] }
      ],
      expected_outcome: 'A valuable developer productivity tool that can be used on real open-source repositories.',
      resume_value: 'Proves deep understanding of software engineering workflows, DevOps integration, and practical LLM automation.',
      status: 'Not Started',
      created_at: demoCreatedAt,
      updated_at: demoCreatedAt
    }
  ],
  progress: [
    {
      user_id: defaultDemoUserId,
      overall_readiness: 78,
      completed_topics: [
        'Python Async Programming',
        'NumPy & Vectorization',
        'SQL Window Functions & Indexing',
        'PyTorch Basics & Autograd',
        'React Component Lifecycle',
        'REST API Design Principles'
      ],
      completed_projects: ['CLI AI Assistant Bot', 'Portfolio Website with Tailwind'],
      assessment_average_score: 85,
      interview_average_score: 82,
      study_streak_days: 6,
      total_study_hours: 38,
      skills_mastery: [
        { skill: 'Python', percentage: 90, level: 'Advanced' },
        { skill: 'SQL', percentage: 85, level: 'Advanced' },
        { skill: 'React & Frontend', percentage: 78, level: 'Intermediate' },
        { skill: 'Machine Learning', percentage: 70, level: 'Intermediate' },
        { skill: 'Generative AI & Gemini API', percentage: 75, level: 'Intermediate' },
        { skill: 'MLOps & Docker', percentage: 45, level: 'Beginner' }
      ],
      recent_activity: [
        { type: 'Assessment', title: 'Full Stack & AI Foundations Quiz', date: 'Yesterday', score: 85 },
        { type: 'Study Task', title: 'Gemini 3.7 Flash SDK Setup', date: '2 days ago' },
        { type: 'Interview', title: 'Python Backend & System Design Round', date: '4 days ago', score: 82 }
      ],
      updated_at: demoCreatedAt
    }
  ],
  interview_sessions: [
    {
      id: 'int-session-1',
      user_id: defaultDemoUserId,
      role: 'AI Engineer',
      difficulty: 'Intermediate',
      topic: 'FastAPI, Model Inference & System Design',
      questions: [
        {
          id: 1,
          question: 'How do you handle rate-limiting and latency bottlenecks when calling external LLM APIs in a high-traffic production service?',
          type: 'Technical',
          topic: 'System Design & LLMs',
          user_answer: 'I would implement an asynchronous queue with Celery or Redis, cache frequent queries with semantic caching (embedding similarity lookup), set up exponential backoff for rate limits, and use streaming responses (SSE) to lower perceived time-to-first-token.',
          score: 92,
          feedback: 'Outstanding technical answer! You covered caching, asynchronous queues, resilience with backoff, and user experience with token streaming.',
          model_answer: 'An optimal production architecture uses semantic caching (Redis with vector indexes) for frequent queries, token bucket rate limiters, asynchronous task queues (Celery/BullMQ) to prevent blocking main web workers, exponential backoff with jitter for HTTP 429 retries, and streaming response chunks directly to users.',
          strengths: ['Mentioned semantic caching', 'Addressed asynchronous queuing', 'Highlighted user experience via streaming'],
          weaknesses: ['Could mention fallback models or circuit breakers if the primary API is temporarily degraded'],
          suggestions: ['Look into circuit-breaker patterns (like Netflix Hystrix or resilient middleware) for enterprise reliability.']
        }
      ],
      overall_score: 92,
      overall_feedback: 'Strong grasp of modern distributed systems and LLM operational engineering.',
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  chat_histories: [
    {
      user_id: defaultDemoUserId,
      messages: [
        {
          id: 'msg-seed-1',
          sender: 'agent',
          content: 'Hello Alex! I am your **Student Learning & Career Agent**. I have reviewed your profile (B.Tech CSE, targeting **AI Engineer**). What would you like to explore or practice today? We can dive into your skill gaps, generate today\'s study tasks, build your research companion project, or practice technical interview questions.',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          suggestions: [
            'What should I learn today?',
            'Analyze my skill gaps for AI Engineer',
            'Give me project building advice',
            'Start a mock interview on LLM System Design'
          ]
        }
      ]
    }
  ]
};

// Persistent Database Manager
class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not read existing database file, initializing default:', e);
    }
    this.saveData(initialDbData);
    return initialDbData;
  }

  private saveData(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  public update(updater: (db: DatabaseSchema) => void) {
    updater(this.data);
    this.saveData(this.data);
  }
}

export const db = new DatabaseManager();
