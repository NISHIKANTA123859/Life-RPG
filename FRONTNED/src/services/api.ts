import axios from 'axios';

export const AUTH_TOKEN_KEY = 'life_rpg_access_token';

// Create base Axios instance targeting FastAPI backend
export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token helpers
export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function storeToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

// Request Interceptor: Attach JWT Bearer token
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle 401 Unauthorized cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearToken();
    }
    return Promise.reject(error);
  }
);

// ── Auth APIs ────────────────────────────────────────────────────────
export async function register(data: {
  name: string;
  email: string;
  password: string;
  confirm_password?: string;
  character_class?: string;
}) {
  const res = await api.post('/auth/register', data);
  if (res.data?.access_token) {
    storeToken(res.data.access_token);
  }
  return res.data;
}

export async function login(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password });
  if (res.data?.access_token) {
    storeToken(res.data.access_token);
  }
  return res.data;
}

export async function getCurrentUser() {
  const res = await api.get('/auth/me');
  return res.data;
}

// ── Character APIs ───────────────────────────────────────────────────
export async function getCharacter() {
  const res = await api.get('/character');
  return res.data;
}

export async function getCharacterStats() {
  const res = await api.get('/character/stats');
  return res.data;
}

// ── Tasks / Quests APIs ──────────────────────────────────────────────
export async function getTasks() {
  const res = await api.get('/tasks');
  return res.data;
}

export const getQuests = getTasks;

export async function getTask(id: number) {
  const res = await api.get(`/tasks/${id}`);
  return res.data;
}

export async function createTask(data: {
  title?: string;
  name?: string;
  description?: string;
  category?: string;
  difficulty?: string;
  due_date?: string;
  deadline?: string;
  estimated_time?: string;
  attribute?: string;
  xp_reward?: number;
  gold_reward?: number;
  attribute_reward?: number;
}) {
  const res = await api.post('/tasks', data);
  return res.data;
}

export const createQuest = createTask;

export async function updateTask(id: number, data: Partial<{
  title: string;
  description: string;
  category: string;
  difficulty: string;
  due_date: string;
  status: string;
}>) {
  const res = await api.put(`/tasks/${id}`, data);
  return res.data;
}

export async function deleteTask(id: number) {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
}

export async function completeTask(id: number) {
  const res = await api.post(`/tasks/${id}/complete`);
  return res.data;
}

export const completeQuest = completeTask;

// ── Daily Progress & Streak APIs ─────────────────────────────────────
export async function getDailyProgress() {
  const res = await api.get('/daily-progress');
  return res.data;
}

export async function getStreak() {
  const res = await api.get('/streak');
  return res.data;
}

// ── Activity, Achievements, Leaderboard & ML Recommendations ────────
export async function getActivity() {
  const res = await api.get('/activity');
  return res.data;
}

export const getActivities = getActivity;

export async function getAchievements() {
  const res = await api.get('/achievements');
  return res.data;
}

export async function getLeaderboard() {
  const res = await api.get('/leaderboard');
  return res.data;
}

export async function getRecommendations() {
  const res = await api.get('/recommendations');
  return res.data;
}

// ── Quest Intelligence APIs ──────────────────────────────────────────
export async function getQuestRecommendations() {
  const res = await api.get('/quest-intelligence/recommendations');
  return res.data;
}

export async function getQuestInsights() {
  const res = await api.get('/quest-intelligence/insights');
  return res.data;
}

export async function getWeeklyCompletion() {
  const res = await api.get('/quest-intelligence/weekly-completion');
  return res.data;
}

export async function getAttributeBalance() {
  const res = await api.get('/quest-intelligence/attribute-balance');
  return res.data;
}

export async function addRecommendationToQuestBoard(id: number) {
  const res = await api.post(`/quest-intelligence/recommendations/${id}/add`);
  return res.data;
}

// ── Seed Demo Data API ───────────────────────────────────────────────
export async function seedDemoData() {
  const res = await api.post('/seed');
  return res.data;
}
