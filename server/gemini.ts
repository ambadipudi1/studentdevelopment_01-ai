import { GoogleGenAI } from '@google/genai';
import type {
  StudentProfile,
  Assessment,
  CareerRecommendation,
  Roadmap,
  StudyPlan,
  Project,
  ProjectGuidanceDetails,
  ProgressData,
  ProgressAnalysis,
  InterviewSession,
  InterviewQuestionItem,
  SkillGapAnalysis
} from '../src/types/index.ts';

// Lazy-initialized GoogleGenAI client
let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-3.7-flash';

// Clean JSON response string from potential markdown formatting
function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

// Build standardized student context
export function formatStudentContext(profile?: StudentProfile | null): string {
  if (!profile) {
    return 'Student Profile: Not completed yet. Assume a motivated undergraduate student exploring technology careers.';
  }
  return `
[STUDENT PROFILE CONTEXT]
Name: ${profile.education || 'Student'} (${profile.degree || 'Degree'} in ${profile.branch || 'Branch'}, Class of ${profile.graduation_year || 'N/A'}, College: ${profile.college || 'N/A'}, CGPA: ${profile.cgpa || 'N/A'})
Current Skills: ${profile.skills?.length ? profile.skills.join(', ') : 'None listed'}
Interests: ${profile.interests?.length ? profile.interests.join(', ') : 'General Technology'}
Target Role / Career Goal: ${profile.target_role || profile.career_goal || 'Software Engineer'}
Experience Level: ${profile.experience_level || 'Beginner'}
Available Study Time: ${profile.available_study_time || '2 hours/day'}
Preferred Learning Style: ${profile.preferred_learning_style || 'Project-based'}
Preferred Language: ${profile.preferred_language || 'English'}
`.trim();
}

const AGENT_SYSTEM_INSTRUCTION = `
You are the single, unified "Student Learning & Career Agent" for STUDENTPATH AI — "Your Personalized AI Learning & Career Guide".
You are an empathetic, insightful, and technically rigorous career mentor and senior engineering educator.

Your Core Directives:
1. Always ground your advice strictly in the provided student profile, skill levels, available study time, and target career goal.
2. Recommend topics and skills in a logical, step-by-step pedagogical sequence (fundamentals first, then advanced concepts, then practical production applications).
3. Provide realistic, high-impact project suggestions with clear resume value and practical architectures.
4. When explaining technical concepts or evaluating interview answers, be precise, encouraging, and actionable.
5. Never guarantee employment or make false claims. Clearly highlight areas for growth while celebrating existing strengths.
6. Always return properly structured responses. When JSON is requested, output ONLY valid, parseable JSON with no markdown wrapping or conversational preamble.
`.trim();

/**
 * 1. AI Coach Chat Response
 */
export async function generateChatResponse(
  message: string,
  history: { sender: 'user' | 'agent'; content: string }[],
  profile?: StudentProfile | null
): Promise<{ text: string; suggestions: string[] }> {
  try {
    const ai = getGenAI();
    const context = formatStudentContext(profile);

    const historyFormatted = history
      .slice(-6)
      .map((h) => `${h.sender === 'user' ? 'Student' : 'AI Mentor'}: ${h.content}`)
      .join('\n\n');

    const prompt = `
${context}

Recent Conversation History:
${historyFormatted || 'No prior messages.'}

Student's Latest Message:
"${message}"

Instructions:
Respond thoughtfully as the Student Learning & Career Agent. Address their question directly with clear, actionable guidance. Keep explanations crisp, formatted with clear markdown, bullet points, and code snippets when helpful.
At the very end of your response, provide exactly 3 short follow-up question pills the student might ask next, formatted on a single line starting with "SUGGESTIONS: [Suggestion 1] | [Suggestion 2] | [Suggestion 3]".
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: AGENT_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const fullText = response.text || "I'm here to help guide your learning and career journey. How can I assist you today?";
    const suggestionMatch = fullText.match(/SUGGESTIONS:\s*(.+)$/i);
    let cleanedText = fullText;
    let suggestions = [
      'What should I learn today?',
      'How do I build a portfolio project?',
      'Can we practice an interview question?'
    ];

    if (suggestionMatch && suggestionMatch[1]) {
      cleanedText = fullText.replace(/SUGGESTIONS:\s*.+$/i, '').trim();
      suggestions = suggestionMatch[1]
        .split('|')
        .map((s) => s.replace(/[\[\]]/g, '').trim())
        .filter(Boolean)
        .slice(0, 3);
    }

    return { text: cleanedText, suggestions };
  } catch (error: any) {
    console.error('Error generating chat response:', error);
    return {
      text: `Hello! I am your Student Learning & Career Agent. Based on your target goal of **${profile?.target_role || 'Software Engineering'}**, I can help you analyze skill gaps, generate study roadmaps, plan projects, or practice technical interview questions. What would you like to work on right now?`,
      suggestions: ['Analyze my skill gap', 'Generate a study plan', 'Practice an interview']
    };
  }
}

/**
 * 2. Career Recommendation
 */
export async function generateCareerRecommendation(
  profile: StudentProfile
): Promise<Partial<CareerRecommendation>> {
  try {
    const ai = getGenAI();
    const context = formatStudentContext(profile);

    const prompt = `
${context}

Task: Perform a deep career fit analysis for this student.
Generate a comprehensive career recommendation in JSON format matching this schema:
{
  "recommended_role": "Primary recommended job title",
  "reasoning": "Detailed 2-3 paragraph explanation of why this role matches their academic degree, skills, and interests",
  "career_paths": [
    {
      "role": "Alternative Role 1",
      "match_percentage": 90,
      "why_fit": "Specific alignment with their skill set",
      "transition_difficulty": "Easy"
    },
    {
      "role": "Alternative Role 2",
      "match_percentage": 85,
      "why_fit": "Why this is an attractive adjacent path",
      "transition_difficulty": "Moderate"
    },
    {
      "role": "Alternative Role 3",
      "match_percentage": 78,
      "why_fit": "Emerging specialization opportunity",
      "transition_difficulty": "Moderate"
    }
  ],
  "required_skills": ["Skill1", "Skill2", "Skill3", "Skill4", "Skill5", "Skill6"],
  "existing_skills": ["List matching skills from student profile"],
  "missing_skills": ["Crucial missing skills they must learn"],
  "next_steps": ["Actionable step 1", "Actionable step 2", "Actionable step 3"],
  "market_demand": "High / Very High / Rapidly Growing description",
  "salary_range": "Estimated entry to mid-level salary range"
}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: AGENT_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      }
    });

    const jsonStr = cleanJsonString(response.text || '{}');
    const parsed = JSON.parse(jsonStr);
    return parsed;
  } catch (error: any) {
    console.error('Error generating career recommendation:', error);
    return {
      recommended_role: profile.target_role || profile.career_goal || 'Full Stack Software Engineer',
      reasoning: `Based on your ${profile.degree || 'academic'} background in ${profile.branch || 'Technology'} with core skills in ${profile.skills?.join(', ') || 'coding'}, you have a solid foundation to excel in modern software and AI engineering roles.`,
      career_paths: [
        {
          role: 'AI / Machine Learning Engineer',
          match_percentage: 88,
          why_fit: 'Strong analytical skills and programming foundation make this a high-impact trajectory.',
          transition_difficulty: 'Moderate'
        },
        {
          role: 'Full Stack Web Developer',
          match_percentage: 90,
          why_fit: 'Direct synergy with frontend and backend application development.',
          transition_difficulty: 'Easy'
        }
      ],
      required_skills: ['Python', 'JavaScript/TypeScript', 'SQL', 'FastAPI / Node.js', 'System Architecture', 'Git'],
      existing_skills: profile.skills || ['Python', 'SQL'],
      missing_skills: ['Cloud Deployment (Docker/GCP)', 'Advanced System Design', 'Vector Databases & LLM Orchestration'],
      next_steps: [
        'Complete the recommended foundational assessment to benchmark knowledge',
        'Follow the personalized multi-phase roadmap',
        'Build 2 production-grade capstone projects'
      ],
      market_demand: 'Extremely High (Top 5 fastest growing tech roles)',
      salary_range: '$85,000 - $130,000'
    };
  }
}

/**
 * 3. Skill Gap Analysis
 */
export async function generateSkillGap(
  profile: StudentProfile,
  targetRole?: string
): Promise<SkillGapAnalysis> {
  const role = targetRole || profile.target_role || profile.career_goal || 'Software Engineer';
  try {
    const ai = getGenAI();
    const context = formatStudentContext(profile);

    const prompt = `
${context}
Target Role to Analyze: "${role}"

Task: Compare the student's current skills against the comprehensive market requirements for "${role}".
Categorize every relevant skill into Strong, Intermediate, Beginner, or Missing.
Return a valid JSON object matching this schema:
{
  "target_role": "${role}",
  "match_score": 75,
  "summary": "Brief 2-sentence summary of their current standing and overall gap",
  "strong_skills": ["Skill1", "Skill2"],
  "intermediate_skills": ["Skill3"],
  "beginner_skills": ["Skill4"],
  "missing_skills": ["Skill5", "Skill6", "Skill7"],
  "recommended_learning_order": ["Skill5", "Skill6", "Skill4", "Skill7"],
  "skills": [
    {
      "skill": "Skill Name",
      "status": "Strong" | "Intermediate" | "Beginner" | "Missing",
      "priority": "High" | "Medium" | "Low",
      "category": "Core Languages" | "Frameworks" | "Databases" | "DevOps & Cloud" | "AI & Data",
      "learning_order": 1,
      "estimated_hours": 20,
      "description": "Why this skill is essential for this target role and how to acquire it"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: AGENT_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      }
    });

    const jsonStr = cleanJsonString(response.text || '{}');
    return JSON.parse(jsonStr);
  } catch (error: any) {
    console.error('Error generating skill gap:', error);
    const existing = profile.skills || ['Python', 'SQL'];
    return {
      target_role: role,
      match_score: 72,
      summary: `You possess strong foundations in ${existing.slice(0, 3).join(', ')}, but need to close gaps in cloud deployment and modern frameworks to become fully job-ready.`,
      strong_skills: existing.slice(0, 2),
      intermediate_skills: existing.slice(2),
      beginner_skills: ['Data Structures & Algorithms'],
      missing_skills: ['FastAPI Backend Design', 'Docker & Containerization', 'Vector Databases & Embeddings', 'CI/CD Pipelines'],
      recommended_learning_order: ['FastAPI Backend Design', 'Docker & Containerization', 'Vector Databases & Embeddings', 'CI/CD Pipelines'],
      skills: [
        {
          skill: 'Python & OOP',
          status: 'Strong',
          priority: 'High',
          category: 'Core Languages',
          learning_order: 1,
          estimated_hours: 10,
          description: 'Essential programming bedrock for backend and data applications.'
        },
        {
          skill: 'SQL & Relational Databases',
          status: 'Intermediate',
          priority: 'High',
          category: 'Databases',
          learning_order: 2,
          estimated_hours: 15,
          description: 'Schema modeling, indexing, joins, and ACID transactions.'
        },
        {
          skill: 'Docker & Containerization',
          status: 'Missing',
          priority: 'High',
          category: 'DevOps & Cloud',
          learning_order: 3,
          estimated_hours: 25,
          description: 'Packaging applications for reproducible cloud deployment.'
        },
        {
          skill: 'Vector DBs & LLM Orchestration',
          status: 'Missing',
          priority: 'Medium',
          category: 'AI & Data',
          learning_order: 4,
          estimated_hours: 30,
          description: 'Building modern AI search, RAG pipelines, and agentic workflows.'
        }
      ],
      created_at: new Date().toISOString()
    };
  }
}

/**
 * 4. Roadmap Generation
 */
export async function generateRoadmap(
  profile: StudentProfile,
  targetRole?: string
): Promise<Roadmap> {
  const role = targetRole || profile.target_role || profile.career_goal || 'Software Engineer';
  try {
    const ai = getGenAI();
    const context = formatStudentContext(profile);

    const prompt = `
${context}
Target Role: "${role}"

Task: Generate a personalized, highly structured learning roadmap for this student to master "${role}".
Do NOT produce a generic one-size-fits-all roadmap; customize the phases based on their current experience level (${profile.experience_level || 'Beginner'}) and available study time (${profile.available_study_time || '2 hours/day'}).

Return a valid JSON object matching this schema:
{
  "title": "Comprehensive ${role} Mastery Roadmap",
  "target_role": "${role}",
  "duration": "12-16 Weeks",
  "stages": [
    {
      "phase": 1,
      "title": "Phase Title",
      "duration": "Weeks 1-3",
      "description": "Detailed phase overview",
      "topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4"],
      "practical_projects": ["Project 1", "Project 2"],
      "learning_outcomes": ["Outcome 1", "Outcome 2"],
      "completed": false
    }
  ]
}
Generate 5 to 6 sequential phases covering fundamentals, intermediate concepts, specialized frameworks, real-world projects, and interview preparation.
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: AGENT_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      }
    });

    const jsonStr = cleanJsonString(response.text || '{}');
    const data = JSON.parse(jsonStr);
    return {
      id: 'roadmap-' + Date.now(),
      user_id: profile.user_id,
      title: data.title || `${role} Roadmap`,
      target_role: role,
      duration: data.duration || '16 Weeks',
      stages: data.stages || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error: any) {
    console.error('Error generating roadmap:', error);
    return {
      id: 'roadmap-' + Date.now(),
      user_id: profile.user_id,
      title: `${role} Learning Journey`,
      target_role: role,
      duration: '14 Weeks',
      stages: [
        {
          phase: 1,
          title: 'Core Programming & Data Structures',
          duration: 'Weeks 1-3',
          description: 'Establish deep programming mastery, algorithms, and clean code hygiene.',
          topics: ['Object-Oriented Programming', 'Time & Space Complexity', 'Trees, Graphs, and Hash Maps', 'Git Workflows'],
          practical_projects: ['Algorithmic Visualizer Tool', 'Custom Data Parser'],
          learning_outcomes: ['Solve medium coding challenges', 'Write clean, modular code'],
          completed: true
        },
        {
          phase: 2,
          title: 'Backend Systems & API Architecture',
          duration: 'Weeks 4-7',
          description: 'Build high-performance RESTful APIs, database transactions, and authentication.',
          topics: ['FastAPI & Async IO', 'PostgreSQL & Query Optimization', 'JWT Authentication & Security', 'Unit Testing with PyTest'],
          practical_projects: ['E-Commerce Backend Microservice', 'Real-time Chat Engine'],
          learning_outcomes: ['Design production-ready REST APIs', 'Manage relational schemas'],
          completed: false
        },
        {
          phase: 3,
          title: 'Applied AI & GenAI Applications',
          duration: 'Weeks 8-11',
          description: 'Integrate Gemini API, vector embeddings, and RAG search pipelines.',
          topics: ['Gemini 3.7 SDK & Structured Outputs', 'Vector Embeddings & Semantic Search', 'Document Processing & Chunking', 'AI Agent Orchestration'],
          practical_projects: ['Document QA RAG Application', 'Autonomous AI Code Reviewer'],
          learning_outcomes: ['Harness modern GenAI models for real business logic'],
          completed: false
        },
        {
          phase: 4,
          title: 'Deployment, Cloud & Mock Interviews',
          duration: 'Weeks 12-14',
          description: 'Deploy to Cloud Run / Docker, optimize performance, and practice technical rounds.',
          topics: ['Docker Multi-stage Builds', 'CI/CD Automation', 'System Design Fundamentals', 'Behavioral Interview STAR Framework'],
          practical_projects: ['Production Live Deployment', 'Portfolio Capstone'],
          learning_outcomes: ['Confidently clear technical and behavioral interview loops'],
          completed: false
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}

/**
 * 5. Study Plan Generation
 */
export async function generateStudyPlan(
  profile: StudentProfile
): Promise<StudyPlan> {
  try {
    const ai = getGenAI();
    const context = formatStudentContext(profile);

    const prompt = `
${context}

Task: Generate a personalized, highly actionable weekly study plan tailored to the student's study capacity (${profile.available_study_time || '2 hours/day'}) and learning style (${profile.preferred_learning_style || 'Project-based'}).

Return a valid JSON object matching this schema:
{
  "duration": "4-Week Intensive Sprint",
  "daily_hours": "${profile.available_study_time || '2 hours/day'}",
  "monthly_goals": [
    "Goal 1: Complete foundational modules",
    "Goal 2: Build 1 full-stack project",
    "Goal 3: Pass 2 mock technical evaluations"
  ],
  "tips": [
    "Tip 1 for their specific learning style",
    "Tip 2 for optimal time management"
  ],
  "weekly_plan": [
    {
      "week_number": 1,
      "focus": "Theme for Week 1 (e.g., Core Principles & Hands-on Setup)",
      "daily_tasks": [
        {
          "id": "w1-d1",
          "day": "Monday",
          "topic": "Specific Topic Name",
          "duration_minutes": 60,
          "task_type": "Concept" | "Practice" | "Project" | "Revision",
          "description": "Clear step-by-step instruction on what to learn or code today",
          "completed": false
        },
        {
          "id": "w1-d2",
          "day": "Tuesday",
          "topic": "Specific Topic Name",
          "duration_minutes": 60,
          "task_type": "Practice",
          "description": "Actionable task",
          "completed": false
        },
        {
          "id": "w1-d3",
          "day": "Wednesday",
          "topic": "Specific Topic Name",
          "duration_minutes": 60,
          "task_type": "Practice",
          "description": "Actionable task",
          "completed": false
        },
        {
          "id": "w1-d4",
          "day": "Thursday",
          "topic": "Specific Topic Name",
          "duration_minutes": 60,
          "task_type": "Concept",
          "description": "Actionable task",
          "completed": false
        },
        {
          "id": "w1-d5",
          "day": "Friday",
          "topic": "Weekly Mini-Project",
          "duration_minutes": 90,
          "task_type": "Project",
          "description": "Hands-on application of concepts learned this week",
          "completed": false
        }
      ]
    },
    {
      "week_number": 2,
      "focus": "Theme for Week 2",
      "daily_tasks": [
        {
          "id": "w2-d1",
          "day": "Monday",
          "topic": "Topic",
          "duration_minutes": 60,
          "task_type": "Concept",
          "description": "Description",
          "completed": false
        },
        {
          "id": "w2-d2",
          "day": "Tuesday",
          "topic": "Topic",
          "duration_minutes": 60,
          "task_type": "Practice",
          "description": "Description",
          "completed": false
        },
        {
          "id": "w2-d3",
          "day": "Wednesday",
          "topic": "Topic",
          "duration_minutes": 60,
          "task_type": "Practice",
          "description": "Description",
          "completed": false
        },
        {
          "id": "w2-d4",
          "day": "Thursday",
          "topic": "Topic",
          "duration_minutes": 60,
          "task_type": "Concept",
          "description": "Description",
          "completed": false
        },
        {
          "id": "w2-d5",
          "day": "Friday",
          "topic": "Mini-Project 2",
          "duration_minutes": 90,
          "task_type": "Project",
          "description": "Description",
          "completed": false
        }
      ]
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: AGENT_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      }
    });

    const jsonStr = cleanJsonString(response.text || '{}');
    const data = JSON.parse(jsonStr);
    return {
      id: 'plan-' + Date.now(),
      user_id: profile.user_id,
      duration: data.duration || '4-Week Sprint',
      daily_hours: profile.available_study_time || '2 hours/day',
      weekly_plan: data.weekly_plan || [],
      completed_items: [],
      monthly_goals: data.monthly_goals || [],
      tips: data.tips || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error: any) {
    console.error('Error generating study plan:', error);
    return {
      id: 'plan-' + Date.now(),
      user_id: profile.user_id,
      duration: '4-Week Plan',
      daily_hours: profile.available_study_time || '2 hours/day',
      completed_items: [],
      weekly_plan: [
        {
          week_number: 1,
          focus: 'Backend Foundations & API Modeling',
          daily_tasks: [
            {
              id: 'd-1',
              day: 'Monday',
              topic: 'FastAPI Router & Schema Validation',
              duration_minutes: 60,
              task_type: 'Concept',
              description: 'Learn Pydantic v2 models and FastAPI dependency injection patterns.',
              completed: false
            },
            {
              id: 'd-2',
              day: 'Tuesday',
              topic: 'SQLAlchemy Async Sessions & CRUD',
              duration_minutes: 60,
              task_type: 'Practice',
              description: 'Write clean database repositories with async engine pooling.',
              completed: false
            },
            {
              id: 'd-3',
              day: 'Wednesday',
              topic: 'JWT Auth & Middleware',
              duration_minutes: 60,
              task_type: 'Practice',
              description: 'Secure API endpoints with token verification and user context.',
              completed: false
            },
            {
              id: 'd-4',
              day: 'Thursday',
              topic: 'Error Handling & Status Codes',
              duration_minutes: 60,
              task_type: 'Concept',
              description: 'Standardize HTTP exceptions and consistent JSON response schemas.',
              completed: false
            },
            {
              id: 'd-5',
              day: 'Friday',
              topic: 'Mini-Project: Secure Note API',
              duration_minutes: 90,
              task_type: 'Project',
              description: 'Build and test a mini auth-protected API service.',
              completed: false
            }
          ]
        }
      ],
      monthly_goals: ['Master async backend programming', 'Build a production-grade portfolio API'],
      tips: ['Study in 45-minute focused blocks with 10-minute breaks to avoid cognitive fatigue.'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}

/**
 * 6. Projects Recommendation
 */
export async function generateProjects(
  profile: StudentProfile,
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
): Promise<Project[]> {
  try {
    const ai = getGenAI();
    const context = formatStudentContext(profile);
    const targetDiff = difficulty || profile.experience_level || 'Intermediate';

    const prompt = `
${context}
Target Difficulty Level: "${targetDiff}"

Task: Generate 3 unique, resume-worthy, industry-grade project recommendations tailored specifically for this student's skills and career goal (${profile.target_role || profile.career_goal || 'Software Engineer'}).
Make them highly practical, avoiding cliché cookie-cutter projects (e.g. avoid basic calculator or generic todo list).

Return a valid JSON array of projects matching this schema:
[
  {
    "title": "Project Title",
    "problem_statement": "The exact real-world problem this project solves",
    "description": "Comprehensive 2-sentence description of the application architecture and features",
    "difficulty": "${targetDiff}",
    "technologies": ["React", "FastAPI", "Gemini API", "PostgreSQL", "Docker"],
    "prerequisites": ["Prereq 1", "Prereq 2"],
    "features": [
      "Key Feature 1",
      "Key Feature 2",
      "Key Feature 3",
      "Key Feature 4"
    ],
    "development_steps": [
      "Step 1: Setup and database modeling",
      "Step 2: API development",
      "Step 3: Frontend component architecture",
      "Step 4: AI integration and testing",
      "Step 5: Cloud containerization"
    ],
    "milestones": [
      { "title": "Milestone 1: Backend Core", "deliverables": ["Models", "Auth API"] },
      { "title": "Milestone 2: AI & Business Logic", "deliverables": ["Gemini prompts", "Vector search"] },
      { "title": "Milestone 3: UI & Polish", "deliverables": ["React components", "Responsive styling"] }
    ],
    "expected_outcome": "What the finished product delivers to users",
    "resume_value": "How to highlight this on a tech resume to stand out to recruiters"
  }
]
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: AGENT_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      }
    });

    const jsonStr = cleanJsonString(response.text || '[]');
    const list = JSON.parse(jsonStr);
    return list.map((p: any, idx: number) => ({
      id: `proj-${Date.now()}-${idx}`,
      user_id: profile.user_id,
      title: p.title,
      problem_statement: p.problem_statement || '',
      description: p.description,
      difficulty: p.difficulty || targetDiff,
      technologies: p.technologies || ['Python', 'React'],
      prerequisites: p.prerequisites || [],
      features: p.features || [],
      development_steps: p.development_steps || [],
      milestones: p.milestones || [],
      expected_outcome: p.expected_outcome || '',
      resume_value: p.resume_value || '',
      status: 'Not Started',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  } catch (error: any) {
    console.error('Error generating projects:', error);
    return [];
  }
}

/**
 * 7. Project Guidance Generator (Step-by-Step Blueprint)
 */
export async function generateProjectGuidance(
  project: Project,
  profile: StudentProfile
): Promise<ProjectGuidanceDetails> {
  try {
    const ai = getGenAI();
    const context = formatStudentContext(profile);

    const prompt = `
${context}

Project to guide:
Title: "${project.title}"
Description: "${project.description}"
Technologies: ${project.technologies.join(', ')}
Difficulty: ${project.difficulty}

Task: Provide deep, comprehensive engineering guidance for the student to build this project from scratch.
Explain code concepts clearly instead of blindly dumping massive boilerplate.

Return a valid JSON object matching this schema:
{
  "architecture_overview": "Comprehensive architectural description of how frontend, backend, database, and AI interact",
  "folder_structure": "ASCII tree or multi-line directory layout",
  "dependencies": ["fastapi", "uvicorn", "google-genai", "pydantic", "react", "tailwindcss", "axios"],
  "database_design": "Detailed entity-relationship explanation with table schemas and relationships",
  "api_design": "List of core endpoints with HTTP methods, request bodies, and expected status responses",
  "frontend_structure": "React component hierarchy and state management approach",
  "backend_structure": "FastAPI/Express route organization, service layers, and controllers",
  "step_by_step_guide": [
    {
      "step": 1,
      "title": "Environment & Project Scaffolding",
      "explanation": "Detailed explanation of what to set up first",
      "key_code_or_command": "pip install -r requirements.txt && npm create vite@latest"
    },
    {
      "step": 2,
      "title": "Database Schema Setup",
      "explanation": "How to define models and migrations",
      "key_code_or_command": "class User(Base): ..."
    },
    {
      "step": 3,
      "title": "Backend API Implementation",
      "explanation": "Building core endpoints",
      "key_code_or_command": "@app.post('/api/items') ..."
    },
    {
      "step": 4,
      "title": "AI Integration Layer",
      "explanation": "Calling Gemini API with structured schemas and error handling",
      "key_code_or_command": "response = client.models.generateContent(...)"
    },
    {
      "step": 5,
      "title": "Frontend UI & API Connection",
      "explanation": "Creating responsive forms, hooks, and views with Tailwind CSS"
    }
  ],
  "testing_debugging_tips": [
    "Tip on unit testing endpoints with pytest",
    "Tip on handling API rate limits",
    "Tip on frontend error boundary handling"
  ],
  "deployment_guide": "Step-by-step instructions to deploy backend and frontend using Docker / Cloud Run",
  "resume_bullet_points": [
    "Engineered a full-stack AI platform using React, FastAPI, and Gemini API reducing query latency by 40%",
    "Implemented secure JWT authentication and relational schema supporting high concurrent requests",
    "Containerized application with Docker multi-stage builds and automated CI/CD deployment"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: AGENT_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      }
    });

    const jsonStr = cleanJsonString(response.text || '{}');
    return JSON.parse(jsonStr);
  } catch (error: any) {
    console.error('Error generating project guidance:', error);
    return {
      architecture_overview: `A modern full-stack application separating React frontend client layers from a robust REST backend powered by Gemini API integration.`,
      folder_structure: `├── backend/\n│   ├── app/\n│   │   ├── main.py\n│   │   ├── models.py\n│   │   └── gemini.py\n│   └── requirements.txt\n└── frontend/\n    ├── src/\n    │   ├── components/\n    │   └── App.tsx\n    └── package.json`,
      dependencies: ['fastapi', 'uvicorn', 'google-genai', 'pydantic', 'react', 'tailwindcss', 'axios'],
      database_design: 'Relational SQLite/PostgreSQL schema tracking user data, document chunks, and query sessions with foreign key constraints.',
      api_design: 'POST /api/items (Create), GET /api/items (List), POST /api/ai/query (Process with Gemini).',
      frontend_structure: 'Modular React functional components with custom hooks for data fetching and optimistic UI updates.',
      backend_structure: 'FastAPI modular router architecture with dependency injection and centralized error handlers.',
      step_by_step_guide: [
        {
          step: 1,
          title: 'Project Setup & Dependencies',
          explanation: 'Initialize the frontend and backend workspaces and install necessary libraries.',
          key_code_or_command: 'npm install && pip install -r requirements.txt'
        },
        {
          step: 2,
          title: 'Database & Schemas',
          explanation: 'Define database tables and validation schemas using Pydantic.',
          key_code_or_command: 'class Item(BaseModel): id: str, title: str'
        },
        {
          step: 3,
          title: 'AI Service Integration',
          explanation: 'Integrate the Google GenAI SDK to process student queries with structured JSON responses.',
          key_code_or_command: 'from google import genai\nclient = genai.Client()'
        },
        {
          step: 4,
          title: 'Frontend Component Polish',
          explanation: 'Build clean, high-contrast Tailwind UI with loading states and error toasts.'
        }
      ],
      testing_debugging_tips: [
        'Validate API request payloads using automated Swagger /docs tests.',
        'Use console logging and try/catch blocks around AI requests to gracefully catch network timeouts.'
      ],
      deployment_guide: 'Package using a Dockerfile and deploy directly to container hosting platforms.',
      resume_bullet_points: [
        `Designed and built ${project.title} utilizing ${project.technologies.slice(0, 3).join(', ')} with Gemini API integration.`,
        'Architected clean REST APIs with structured JSON output and comprehensive input validation.'
      ]
    };
  }
}

/**
 * 8. Assessment Generator
 */
export async function generateAssessmentQuestions(
  profile: StudentProfile,
  assessmentType: string,
  count = 5
): Promise<Assessment> {
  try {
    const ai = getGenAI();
    const context = formatStudentContext(profile);

    const prompt = `
${context}
Assessment Subject/Type: "${assessmentType}"
Number of Questions: ${count}

Task: Generate an interactive, technically challenging assessment that evaluates conceptual understanding, technical problem solving, and scenario decision making for the student's target role (${profile.target_role || 'Software Engineer'}).

Return a valid JSON object matching this schema:
{
  "assessment_type": "${assessmentType}",
  "questions": [
    {
      "id": 1,
      "question": "Clear, technically rigorous question text",
      "type": "multiple_choice" | "technical" | "conceptual" | "scenario",
      "options": [
        "Option A text",
        "Option B text",
        "Option C text",
        "Option D text"
      ],
      "correct_answer": "Option A text",
      "explanation": "Clear explanation of why this answer is correct and why other options fail",
      "topic": "Specific Topic Name"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: AGENT_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      }
    });

    const jsonStr = cleanJsonString(response.text || '{}');
    const data = JSON.parse(jsonStr);
    return {
      id: 'assessment-' + Date.now(),
      user_id: profile.user_id,
      assessment_type: assessmentType,
      target_role: profile.target_role,
      questions: data.questions || [],
      score: 0,
      total_questions: data.questions?.length || count,
      strengths: [],
      weaknesses: [],
      recommended_topics: [],
      created_at: new Date().toISOString()
    };
  } catch (error: any) {
    console.error('Error generating assessment:', error);
    return {
      id: 'assessment-' + Date.now(),
      user_id: profile.user_id,
      assessment_type: assessmentType,
      target_role: profile.target_role,
      questions: [
        {
          id: 1,
          question: 'What is the primary benefit of database indexing on frequently queried columns?',
          type: 'conceptual',
          options: [
            'Reduces disk space usage by compressing table rows',
            'Decreases read query execution time from O(N) full table scan to O(log N) lookup',
            'Automatically enforces foreign key relational integrity',
            'Prevents SQL injection attacks'
          ],
          correct_answer: 'Decreases read query execution time from O(N) full table scan to O(log N) lookup',
          explanation: 'Indexes (such as B-Trees) enable logarithmic time search rather than scanning every record in the table.',
          topic: 'Database Optimization'
        },
        {
          id: 2,
          question: 'In modern asynchronous web frameworks (like FastAPI), why is non-blocking I/O advantageous for LLM API calls?',
          type: 'technical',
          options: [
            'It multiplies server CPU clock speed',
            'It frees up the event loop worker to serve other requests while waiting for network responses',
            'It bypasses Gemini API authentication restrictions',
            'It automatically caches all HTTP responses in RAM'
          ],
          correct_answer: 'It frees up the event loop worker to serve other requests while waiting for network responses',
          explanation: 'Async event loops allow single worker processes to handle hundreds of concurrent I/O-bound operations without blocking.',
          topic: 'API Concurrency'
        }
      ],
      score: 0,
      total_questions: 2,
      strengths: [],
      weaknesses: [],
      recommended_topics: ['Database Indexing', 'Async Concurrency'],
      created_at: new Date().toISOString()
    };
  }
}

/**
 * 9. Assessment Submission & Evaluation
 */
export async function evaluateAssessment(
  questions: any[],
  answers: Record<string, string>,
  profile: StudentProfile
): Promise<Partial<Assessment>> {
  let correctCount = 0;
  const total = questions.length;
  const userResults: any[] = [];

  for (const q of questions) {
    const userAns = answers[q.id.toString()] || answers[q.id];
    const isCorrect = userAns && q.correct_answer && userAns.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();
    if (isCorrect) correctCount++;
    userResults.push({
      question: q.question,
      topic: q.topic,
      user_answer: userAns || 'Unanswered',
      correct_answer: q.correct_answer,
      is_correct: !!isCorrect
    });
  }

  const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  try {
    const ai = getGenAI();
    const prompt = `
Student Assessment Results:
Score: ${score}% (${correctCount}/${total} correct)
Questions and Answers:
${JSON.stringify(userResults, null, 2)}

Task: Analyze these results and return a JSON object with:
{
  "strengths": ["Identified strong topic 1", "Identified strong topic 2"],
  "weaknesses": ["Specific concept missed 1", "Specific concept missed 2"],
  "missing_concepts": ["Deeper underlying principle to review"],
  "recommended_topics": ["Suggested next topic to study 1", "Suggested next topic 2"],
  "feedback": "Encouraging, constructive 2-sentence diagnostic assessment summary"
}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: AGENT_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      }
    });

    const jsonStr = cleanJsonString(response.text || '{}');
    const evaluation = JSON.parse(jsonStr);

    return {
      score,
      total_questions: total,
      answers,
      strengths: evaluation.strengths || ['Good foundational grasp'],
      weaknesses: evaluation.weaknesses || ['Advanced edge cases'],
      missing_concepts: evaluation.missing_concepts || [],
      recommended_topics: evaluation.recommended_topics || ['Review missed topics'],
      feedback: evaluation.feedback || `You achieved a score of ${score}%. Great effort!`
    };
  } catch (error: any) {
    console.error('Error evaluating assessment with AI:', error);
    return {
      score,
      total_questions: total,
      answers,
      strengths: ['Demonstrated core understanding on correct items'],
      weaknesses: ['Review items answered incorrectly'],
      recommended_topics: ['Core algorithms & architectural principles'],
      feedback: `You completed the assessment with a score of ${score}%.`
    };
  }
}

/**
 * 10. Interview Preparation (Questions Generation)
 */
export async function generateInterviewQuestions(
  role: string,
  difficulty: string,
  topic: string,
  count = 3
): Promise<InterviewQuestionItem[]> {
  try {
    const ai = getGenAI();
    const prompt = `
Generate ${count} realistic, challenging interview questions for:
Target Role: "${role}"
Difficulty Level: "${difficulty}"
Focus Topic/Area: "${topic}"

Include a mix of Technical, Scenario, and Behavioral/System questions.
Return a valid JSON array of questions matching:
[
  {
    "id": 1,
    "question": "Question text",
    "type": "Technical" | "Scenario" | "Behavioral" | "Project",
    "topic": "${topic}"
  }
]
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: AGENT_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      }
    });

    const jsonStr = cleanJsonString(response.text || '[]');
    return JSON.parse(jsonStr);
  } catch (error: any) {
    console.error('Error generating interview questions:', error);
    return [
      {
        id: 1,
        question: `Explain how you would architect a resilient backend service for ${role} with high availability and low latency.`,
        type: 'Technical',
        topic: topic || 'System Architecture'
      },
      {
        id: 2,
        question: 'Describe a challenging bug you encountered in a project, how you diagnosed the root cause, and how you resolved it.',
        type: 'Behavioral',
        topic: 'Problem Solving & Debugging'
      }
    ];
  }
}

/**
 * 11. Interview Answer Evaluation
 */
export async function evaluateInterviewAnswer(
  question: string,
  userAnswer: string,
  role: string,
  difficulty: string
): Promise<{
  score: number;
  feedback: string;
  model_answer: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}> {
  try {
    const ai = getGenAI();
    const prompt = `
Interview Context:
Role: "${role}"
Difficulty: "${difficulty}"
Question: "${question}"

Student's Answer:
"${userAnswer}"

Task: Evaluate this response based on:
1. Technical correctness & accuracy
2. Completeness & depth
3. Structure & clarity (e.g. STAR method for behavioral, architectural trade-offs for technical)
4. Relevance to the role

Return a valid JSON object matching:
{
  "score": 88,
  "feedback": "Comprehensive, constructive paragraph analyzing their answer",
  "model_answer": "An exemplary, industry-standard model response that an interviewer would rate 100%",
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Area for growth 1", "Area for growth 2"],
  "suggestions": ["Concrete recommendation 1", "Concrete recommendation 2"]
}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: AGENT_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      }
    });

    const jsonStr = cleanJsonString(response.text || '{}');
    return JSON.parse(jsonStr);
  } catch (error: any) {
    console.error('Error evaluating interview answer:', error);
    return {
      score: 75,
      feedback: 'Good foundational answer. You communicated your thoughts clearly, but could provide more specific technical depth and concrete metrics.',
      model_answer: 'A comprehensive answer highlights structural design patterns, error handling, performance trade-offs, and measurable outcomes.',
      strengths: ['Clear communication', 'Addressed the core question'],
      weaknesses: ['Could include more low-level technical specifics'],
      suggestions: ['Use concrete metrics and quantifiable achievements when describing solutions.']
    };
  }
}

/**
 * 12. AI Progress Analysis
 */
export async function analyzeProgress(
  profile: StudentProfile,
  progress: ProgressData,
  assessments: Assessment[],
  interviews: InterviewSession[]
): Promise<ProgressAnalysis> {
  try {
    const ai = getGenAI();
    const context = formatStudentContext(profile);

    const prompt = `
${context}

Student Learning History & Metrics:
Overall Readiness Score: ${progress.overall_readiness}%
Completed Topics: ${progress.completed_topics?.join(', ') || 'None'}
Completed Projects: ${progress.completed_projects?.join(', ') || 'None'}
Assessment Average: ${progress.assessment_average_score}% (${assessments.length} assessments completed)
Interview Average: ${progress.interview_average_score}% (${interviews.length} sessions completed)
Study Streak: ${progress.study_streak_days} days

Task: Synthesize this student's holistic performance. Provide a strategic, encouraging, and actionable progress assessment.

Return a valid JSON object matching this schema:
{
  "readiness_status": "On Track / Needs Acceleration / Ready for Interviews",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "improvements": ["Key area where student made major recent progress"],
  "next_topic": "Exact recommended topic to master next",
  "recommended_project": "Exact recommended project to build next",
  "study_adjustment": "Recommended adjustment to daily study pacing or schedule",
  "motivational_insight": "Inspirational 2-sentence mentor message"
}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: AGENT_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      }
    });

    const jsonStr = cleanJsonString(response.text || '{}');
    const data = JSON.parse(jsonStr);
    return {
      ...data,
      created_at: new Date().toISOString()
    };
  } catch (error: any) {
    console.error('Error analyzing progress:', error);
    return {
      readiness_status: 'On Track',
      strengths: ['Consistent daily study habit', 'Strong algorithm and database fundamentals'],
      weaknesses: ['Cloud deployment and containerization practice'],
      improvements: ['Significant improvement in RESTful API design'],
      next_topic: 'Vector Databases & Embeddings',
      recommended_project: 'Context-Aware AI Document Companion',
      study_adjustment: 'Maintain your 2 hour/day cadence with 60% dedicated to hands-on coding.',
      motivational_insight: 'Your dedication is translating directly into tangible technical growth. Stay focused on building real portfolio applications!',
      created_at: new Date().toISOString()
    };
  }
}
