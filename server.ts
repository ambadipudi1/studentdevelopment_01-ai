import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db, hashPassword, generateToken, verifyToken } from './server/db.ts';
import {
  generateChatResponse,
  generateCareerRecommendation,
  generateSkillGap,
  generateRoadmap,
  generateStudyPlan,
  generateProjects,
  generateProjectGuidance,
  generateAssessmentQuestions,
  evaluateAssessment,
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  analyzeProgress
} from './server/gemini.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// CORS & logging middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Authentication middleware
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  const userId = verifyToken(token);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid token' });
  }

  const user = db.getData().users.find((u) => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: User not found' });
  }

  (req as any).user = user;
  next();
}

/* ============================================================
   1. AUTHENTICATION ENDPOINTS
   ============================================================ */

// Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existing = db.getData().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUserId = 'user-' + Date.now();
  const now = new Date().toISOString();
  const newUser = {
    id: newUserId,
    name,
    email: email.toLowerCase(),
    password_hash: hashPassword(password),
    created_at: now,
    updated_at: now
  };

  db.update((data) => {
    data.users.push(newUser);
    // Initialize default progress record
    data.progress.push({
      user_id: newUserId,
      overall_readiness: 15,
      completed_topics: [],
      completed_projects: [],
      assessment_average_score: 0,
      interview_average_score: 0,
      study_streak_days: 1,
      total_study_hours: 0,
      skills_mastery: [],
      recent_activity: [{ type: 'Account', title: 'Joined STUDENTPATH AI', date: 'Today' }],
      updated_at: now
    });
  });

  const token = generateToken(newUserId);
  const { password_hash, ...userWithoutPass } = newUser;
  res.status(201).json({ user: userWithoutPass, token, profile: null });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.getData().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password_hash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken(user.id);
  const profile = db.getData().profiles.find((p) => p.user_id === user.id) || null;
  const { password_hash, ...userWithoutPass } = user;

  res.json({ user: userWithoutPass, token, profile });
});

// Get Current User
app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = (req as any).user;
  const profile = db.getData().profiles.find((p) => p.user_id === user.id) || null;
  const { password_hash, ...userWithoutPass } = user;
  res.json({ user: userWithoutPass, profile });
});

/* ============================================================
   2. STUDENT PROFILE ENDPOINTS
   ============================================================ */

app.get('/api/profile', requireAuth, (req, res) => {
  const user = (req as any).user;
  const profile = db.getData().profiles.find((p) => p.user_id === user.id) || null;
  res.json({ profile });
});

app.post('/api/profile', requireAuth, (req, res) => {
  const user = (req as any).user;
  const existing = db.getData().profiles.find((p) => p.user_id === user.id);
  const now = new Date().toISOString();

  const profileData = {
    ...req.body,
    id: existing ? existing.id : 'profile-' + Date.now(),
    user_id: user.id,
    skills: Array.isArray(req.body.skills) ? req.body.skills : [],
    interests: Array.isArray(req.body.interests) ? req.body.interests : [],
    updated_at: now
  };

  db.update((data) => {
    const idx = data.profiles.findIndex((p) => p.user_id === user.id);
    if (idx >= 0) {
      data.profiles[idx] = { ...data.profiles[idx], ...profileData };
    } else {
      data.profiles.push({ ...profileData, created_at: now });
    }

    // Update progress skills mastery
    const prog = data.progress.find((p) => p.user_id === user.id);
    if (prog && profileData.skills?.length) {
      prog.skills_mastery = profileData.skills.map((s: string) => ({
        skill: s,
        percentage: 60 + Math.floor(Math.random() * 30),
        level: profileData.experience_level || 'Intermediate'
      }));
    }
  });

  const updated = db.getData().profiles.find((p) => p.user_id === user.id);
  res.json({ profile: updated });
});

app.put('/api/profile', requireAuth, (req, res) => {
  const user = (req as any).user;
  const now = new Date().toISOString();

  db.update((data) => {
    const idx = data.profiles.findIndex((p) => p.user_id === user.id);
    if (idx >= 0) {
      data.profiles[idx] = {
        ...data.profiles[idx],
        ...req.body,
        skills: Array.isArray(req.body.skills) ? req.body.skills : data.profiles[idx].skills,
        interests: Array.isArray(req.body.interests) ? req.body.interests : data.profiles[idx].interests,
        updated_at: now
      };
    } else {
      data.profiles.push({
        id: 'profile-' + Date.now(),
        user_id: user.id,
        ...req.body,
        skills: Array.isArray(req.body.skills) ? req.body.skills : [],
        interests: Array.isArray(req.body.interests) ? req.body.interests : [],
        created_at: now,
        updated_at: now
      });
    }
  });

  const updated = db.getData().profiles.find((p) => p.user_id === user.id);
  res.json({ profile: updated });
});

app.delete('/api/profile', requireAuth, (req, res) => {
  const user = (req as any).user;
  db.update((data) => {
    data.profiles = data.profiles.filter((p) => p.user_id !== user.id);
  });
  res.json({ success: true, message: 'Profile removed successfully' });
});

/* ============================================================
   3. AI STUDENT LEARNING & CAREER AGENT ENDPOINTS
   ============================================================ */

// 1. AI Coach Chat
app.post('/api/ai/chat', requireAuth, async (req, res) => {
  const user = (req as any).user;
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const profile = db.getData().profiles.find((p) => p.user_id === user.id) || null;
  let userChat = db.getData().chat_histories.find((c) => c.user_id === user.id);
  if (!userChat) {
    userChat = { user_id: user.id, messages: [] };
    db.update((d) => d.chat_histories.push(userChat!));
  }

  const userMsg = {
    id: 'msg-' + Date.now(),
    sender: 'user' as const,
    content: message,
    timestamp: new Date().toISOString()
  };

  db.update((d) => {
    const uc = d.chat_histories.find((c) => c.user_id === user.id);
    if (uc) uc.messages.push(userMsg);
  });

  const aiResult = await generateChatResponse(message, userChat.messages, profile);

  const agentMsg = {
    id: 'msg-' + (Date.now() + 1),
    sender: 'agent' as const,
    content: aiResult.text,
    timestamp: new Date().toISOString(),
    suggestions: aiResult.suggestions
  };

  db.update((d) => {
    const uc = d.chat_histories.find((c) => c.user_id === user.id);
    if (uc) uc.messages.push(agentMsg);
  });

  res.json({ message: agentMsg, history: userChat.messages });
});

app.get('/api/ai/chat-history', requireAuth, (req, res) => {
  const user = (req as any).user;
  const userChat = db.getData().chat_histories.find((c) => c.user_id === user.id);
  res.json({ messages: userChat ? userChat.messages : [] });
});

// 2. Career Recommendation
app.post('/api/ai/career-recommendation', requireAuth, async (req, res) => {
  const user = (req as any).user;
  const profile = db.getData().profiles.find((p) => p.user_id === user.id);
  if (!profile) {
    return res.status(400).json({ error: 'Please complete your student profile first' });
  }

  const result = await generateCareerRecommendation(profile);
  const now = new Date().toISOString();

  const careerRec = {
    id: 'career-rec-' + Date.now(),
    user_id: user.id,
    recommended_role: result.recommended_role || profile.target_role || 'AI & Software Engineer',
    career_paths: result.career_paths || [],
    reasoning: result.reasoning || '',
    required_skills: result.required_skills || [],
    existing_skills: result.existing_skills || profile.skills || [],
    missing_skills: result.missing_skills || [],
    next_steps: result.next_steps || [],
    market_demand: result.market_demand || 'High',
    salary_range: result.salary_range || '$85k - $130k',
    created_at: now
  };

  db.update((data) => {
    const idx = data.career_recommendations.findIndex((c) => c.user_id === user.id);
    if (idx >= 0) {
      data.career_recommendations[idx] = careerRec;
    } else {
      data.career_recommendations.push(careerRec);
    }
  });

  res.json({ recommendation: careerRec });
});

app.get('/api/ai/career-recommendation', requireAuth, (req, res) => {
  const user = (req as any).user;
  const rec = db.getData().career_recommendations.find((c) => c.user_id === user.id) || null;
  res.json({ recommendation: rec });
});

// 3. Skill Gap Analysis
app.post('/api/ai/skill-gap', requireAuth, async (req, res) => {
  const user = (req as any).user;
  const profile = db.getData().profiles.find((p) => p.user_id === user.id);
  if (!profile) {
    return res.status(400).json({ error: 'Please complete your student profile first' });
  }

  const { targetRole } = req.body;
  const analysis = await generateSkillGap(profile, targetRole);
  res.json({ analysis });
});

// 4. Roadmap
app.post('/api/ai/roadmap', requireAuth, async (req, res) => {
  const user = (req as any).user;
  const profile = db.getData().profiles.find((p) => p.user_id === user.id);
  if (!profile) {
    return res.status(400).json({ error: 'Please complete your student profile first' });
  }

  const { targetRole } = req.body;
  const roadmap = await generateRoadmap(profile, targetRole);

  db.update((data) => {
    const idx = data.roadmaps.findIndex((r) => r.user_id === user.id);
    if (idx >= 0) {
      data.roadmaps[idx] = roadmap;
    } else {
      data.roadmaps.push(roadmap);
    }
  });

  res.json({ roadmap });
});

app.get('/api/ai/roadmap', requireAuth, (req, res) => {
  const user = (req as any).user;
  const roadmap = db.getData().roadmaps.find((r) => r.user_id === user.id) || null;
  res.json({ roadmap });
});

// 5. Study Plan
app.post('/api/ai/study-plan', requireAuth, async (req, res) => {
  const user = (req as any).user;
  const profile = db.getData().profiles.find((p) => p.user_id === user.id);
  if (!profile) {
    return res.status(400).json({ error: 'Please complete your student profile first' });
  }

  const studyPlan = await generateStudyPlan(profile);

  db.update((data) => {
    const idx = data.study_plans.findIndex((s) => s.user_id === user.id);
    if (idx >= 0) {
      data.study_plans[idx] = studyPlan;
    } else {
      data.study_plans.push(studyPlan);
    }
  });

  res.json({ studyPlan });
});

app.get('/api/ai/study-plan', requireAuth, (req, res) => {
  const user = (req as any).user;
  const studyPlan = db.getData().study_plans.find((s) => s.user_id === user.id) || null;
  res.json({ studyPlan });
});

app.post('/api/study-plan/toggle-task', requireAuth, (req, res) => {
  const user = (req as any).user;
  const { taskId } = req.body;
  if (!taskId) return res.status(400).json({ error: 'taskId required' });

  let updatedPlan: any = null;
  db.update((data) => {
    const plan = data.study_plans.find((s) => s.user_id === user.id);
    if (plan) {
      for (const week of plan.weekly_plan) {
        for (const task of week.daily_tasks) {
          if (task.id === taskId) {
            task.completed = !task.completed;
            if (task.completed) {
              if (!plan.completed_items.includes(taskId)) plan.completed_items.push(taskId);
            } else {
              plan.completed_items = plan.completed_items.filter((id) => id !== taskId);
            }
          }
        }
      }
      plan.updated_at = new Date().toISOString();
      updatedPlan = plan;
    }
  });

  res.json({ studyPlan: updatedPlan });
});

// 6. Projects
app.post('/api/ai/projects', requireAuth, async (req, res) => {
  const user = (req as any).user;
  const profile = db.getData().profiles.find((p) => p.user_id === user.id);
  if (!profile) {
    return res.status(400).json({ error: 'Please complete your student profile first' });
  }

  const { difficulty } = req.body;
  const projects = await generateProjects(profile, difficulty);

  db.update((data) => {
    // Keep user-created or active projects, merge new recommendations
    const existing = data.projects.filter((p) => p.user_id === user.id && p.status !== 'Not Started');
    data.projects = [...data.projects.filter((p) => p.user_id !== user.id), ...existing, ...projects];
  });

  const userProjects = db.getData().projects.filter((p) => p.user_id === user.id);
  res.json({ projects: userProjects });
});

app.get('/api/ai/projects', requireAuth, (req, res) => {
  const user = (req as any).user;
  const projects = db.getData().projects.filter((p) => p.user_id === user.id);
  res.json({ projects });
});

// 7. Project Guidance
app.post('/api/ai/project-guidance', requireAuth, async (req, res) => {
  const user = (req as any).user;
  const { projectId } = req.body;
  const profile = db.getData().profiles.find((p) => p.user_id === user.id);
  if (!profile) return res.status(400).json({ error: 'Profile required' });

  const project = db.getData().projects.find((p) => p.id === projectId && p.user_id === user.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const guidance = await generateProjectGuidance(project, profile);

  db.update((data) => {
    const p = data.projects.find((pr) => pr.id === projectId && pr.user_id === user.id);
    if (p) {
      p.guidance = guidance;
      p.updated_at = new Date().toISOString();
    }
  });

  res.json({ guidance });
});

app.put('/api/projects/:id/status', requireAuth, (req, res) => {
  const user = (req as any).user;
  const { id } = req.params;
  const { status } = req.body;

  let updated: any = null;
  db.update((data) => {
    const p = data.projects.find((pr) => pr.id === id && pr.user_id === user.id);
    if (p) {
      p.status = status;
      p.updated_at = new Date().toISOString();
      updated = p;

      // Update progress completed projects
      const prog = data.progress.find((pr) => pr.user_id === user.id);
      if (prog && status === 'Completed' && !prog.completed_projects.includes(p.title)) {
        prog.completed_projects.push(p.title);
        prog.overall_readiness = Math.min(100, prog.overall_readiness + 5);
      }
    }
  });

  res.json({ project: updated });
});

/* ============================================================
   4. ASSESSMENT ENDPOINTS
   ============================================================ */

// Generate Assessment
app.post('/api/assessment/generate', requireAuth, async (req, res) => {
  const user = (req as any).user;
  const profile = db.getData().profiles.find((p) => p.user_id === user.id);
  if (!profile) {
    return res.status(400).json({ error: 'Please complete your student profile first' });
  }

  const { assessmentType, count } = req.body;
  const assessment = await generateAssessmentQuestions(
    profile,
    assessmentType || `${profile.target_role || 'Full Stack'} Core Readiness`,
    count || 5
  );

  res.json({ assessment });
});

// Submit Assessment
app.post('/api/assessment/submit', requireAuth, async (req, res) => {
  const user = (req as any).user;
  const profile = db.getData().profiles.find((p) => p.user_id === user.id);
  if (!profile) return res.status(400).json({ error: 'Profile required' });

  const { questions, answers, assessmentType } = req.body;
  if (!questions || !answers) {
    return res.status(400).json({ error: 'Questions and answers required' });
  }

  const evalResult = await evaluateAssessment(questions, answers, profile);
  const now = new Date().toISOString();

  const finalAssessment = {
    id: 'assessment-' + Date.now(),
    user_id: user.id,
    assessment_type: assessmentType || 'Skills Assessment',
    target_role: profile.target_role,
    questions,
    answers,
    score: evalResult.score || 0,
    total_questions: evalResult.total_questions || questions.length,
    strengths: evalResult.strengths || [],
    weaknesses: evalResult.weaknesses || [],
    missing_concepts: evalResult.missing_concepts || [],
    recommended_topics: evalResult.recommended_topics || [],
    feedback: evalResult.feedback || '',
    created_at: now
  };

  db.update((data) => {
    data.assessments.push(finalAssessment);

    // Update student progress metrics
    const prog = data.progress.find((p) => p.user_id === user.id);
    if (prog) {
      const userAssessments = data.assessments.filter((a) => a.user_id === user.id);
      const totalScore = userAssessments.reduce((acc, a) => acc + a.score, 0);
      prog.assessment_average_score = Math.round(totalScore / userAssessments.length);
      prog.recent_activity.unshift({
        type: 'Assessment',
        title: `${finalAssessment.assessment_type} Completed`,
        date: 'Just now',
        score: finalAssessment.score
      });
      prog.overall_readiness = Math.min(100, Math.round((prog.assessment_average_score + prog.interview_average_score) / 2 + 10));
    }
  });

  res.json({ assessment: finalAssessment });
});

// Assessment History
app.get('/api/assessment/history', requireAuth, (req, res) => {
  const user = (req as any).user;
  const history = db.getData().assessments.filter((a) => a.user_id === user.id);
  res.json({ history });
});

/* ============================================================
   5. INTERVIEW PREPARATION & EVALUATION ENDPOINTS
   ============================================================ */

// Start Interview / Generate Questions
app.post('/api/ai/interview', requireAuth, async (req, res) => {
  const user = (req as any).user;
  const { role, difficulty, topic, count } = req.body;

  const questions = await generateInterviewQuestions(
    role || 'AI / Software Engineer',
    difficulty || 'Intermediate',
    topic || 'General Technical & Problem Solving',
    count || 3
  );

  const session: any = {
    id: 'interview-' + Date.now(),
    user_id: user.id,
    role: role || 'AI / Software Engineer',
    difficulty: difficulty || 'Intermediate',
    topic: topic || 'General Technical',
    questions,
    created_at: new Date().toISOString()
  };

  db.update((data) => {
    data.interview_sessions.push(session);
  });

  res.json({ session });
});

// Evaluate Single Answer or Complete Session
app.post('/api/ai/interview-evaluate', requireAuth, async (req, res) => {
  const user = (req as any).user;
  const { sessionId, questionId, answer, role, difficulty, questionText } = req.body;

  const evaluation = await evaluateInterviewAnswer(
    questionText || 'Interview Question',
    answer || '',
    role || 'Engineer',
    difficulty || 'Intermediate'
  );

  db.update((data) => {
    const session = data.interview_sessions.find((s) => s.id === sessionId && s.user_id === user.id);
    if (session) {
      const q = session.questions.find((item) => item.id === questionId);
      if (q) {
        q.user_answer = answer;
        q.score = evaluation.score;
        q.feedback = evaluation.feedback;
        q.model_answer = evaluation.model_answer;
        q.strengths = evaluation.strengths;
        q.weaknesses = evaluation.weaknesses;
        q.suggestions = evaluation.suggestions;
      }

      // Calculate session overall score
      const answered = session.questions.filter((item) => item.score !== undefined);
      if (answered.length > 0) {
        const sum = answered.reduce((acc, item) => acc + (item.score || 0), 0);
        session.overall_score = Math.round(sum / answered.length);
        session.overall_feedback = evaluation.feedback;
      }
    }

    // Update student progress metrics
    const prog = data.progress.find((p) => p.user_id === user.id);
    if (prog) {
      const userSessions = data.interview_sessions.filter((s) => s.user_id === user.id && s.overall_score !== undefined);
      if (userSessions.length > 0) {
        const sum = userSessions.reduce((acc, s) => acc + (s.overall_score || 0), 0);
        prog.interview_average_score = Math.round(sum / userSessions.length);
      }
      prog.recent_activity.unshift({
        type: 'Interview',
        title: `Mock Interview: ${role}`,
        date: 'Just now',
        score: evaluation.score
      });
    }
  });

  res.json({ evaluation });
});

// Interview History
app.get('/api/ai/interview-history', requireAuth, (req, res) => {
  const user = (req as any).user;
  const history = db.getData().interview_sessions.filter((s) => s.user_id === user.id);
  res.json({ history });
});

/* ============================================================
   6. PROGRESS & ANALYTICS ENDPOINTS
   ============================================================ */

app.get('/api/progress', requireAuth, (req, res) => {
  const user = (req as any).user;
  let progress = db.getData().progress.find((p) => p.user_id === user.id);
  if (!progress) {
    progress = {
      user_id: user.id,
      overall_readiness: 45,
      completed_topics: [],
      completed_projects: [],
      assessment_average_score: 0,
      interview_average_score: 0,
      study_streak_days: 1,
      total_study_hours: 5,
      skills_mastery: [],
      recent_activity: [],
      updated_at: new Date().toISOString()
    };
    db.update((data) => data.progress.push(progress!));
  }
  res.json({ progress });
});

app.post('/api/ai/progress-analysis', requireAuth, async (req, res) => {
  const user = (req as any).user;
  const profile = db.getData().profiles.find((p) => p.user_id === user.id);
  if (!profile) return res.status(400).json({ error: 'Profile required' });

  const progress = db.getData().progress.find((p) => p.user_id === user.id) || {
    user_id: user.id,
    overall_readiness: 50,
    completed_topics: [],
    completed_projects: [],
    assessment_average_score: 0,
    interview_average_score: 0,
    study_streak_days: 1,
    total_study_hours: 0,
    skills_mastery: [],
    recent_activity: [],
    updated_at: new Date().toISOString()
  };

  const assessments = db.getData().assessments.filter((a) => a.user_id === user.id);
  const interviews = db.getData().interview_sessions.filter((s) => s.user_id === user.id);

  const analysis = await analyzeProgress(profile, progress, assessments, interviews);
  res.json({ analysis });
});

// System Status & Health
app.get('/api/system/status', (req, res) => {
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-3.7-flash';
  res.json({
    status: 'operational',
    service: 'STUDENTPATH AI Backend',
    agent: 'Student Learning & Career Agent',
    gemini_api_configured: hasGeminiKey,
    gemini_model: model,
    timestamp: new Date().toISOString()
  });
});

/* ============================================================
   7. VITE DEV SERVER & PRODUCTION STATIC SERVING
   ============================================================ */

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`STUDENTPATH AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
