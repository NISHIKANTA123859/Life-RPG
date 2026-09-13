// src/services/api.ts

import axios from "axios";
import type { AxiosInstance } from "axios";

// Base URL for FastAPI backend
const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

// Request interceptor – attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor – handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalid or expired – clear and redirect to login
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/*** AUTH ***/
export const register = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  characterClass: string
) => {
  console.log('Register payload ->', {
    name,
    email,
    password,
    confirm_password: confirmPassword,
    character_class: characterClass,
  });
  const payload = {
    name,
    email,
    password,
    confirm_password: confirmPassword,
    character_class: characterClass,
  };
  const response = await api.post("/auth/register", payload);
  const { access_token, refresh_token } = response.data;
  if (access_token) {
    localStorage.setItem("access_token", access_token);
  }
  if (refresh_token) {
    localStorage.setItem("refresh_token", refresh_token);
  }
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  const { access_token, refresh_token } = response.data;
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

/*** CHARACTER ***/
export const getCharacter = async () => {
  const response = await api.get("/character");
  return response.data;
};

export const getCharacterStats = async () => {
  const response = await api.get("/character/stats");
  return response.data;
};

/*** QUESTS / TASKS ***/
export const getTasks = async () => {
  const response = await api.get("/tasks");
  return response.data;
};

export const getTask = async (id: number) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (payload: any) => {
  const response = await api.post("/tasks", payload);
  return response.data;
};

export const updateTask = async (id: number, payload: any) => {
  const response = await api.put(`/tasks/${id}`, payload);
  return response.data;
};

export const deleteTask = async (id: number) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export const completeTask = async (id: number) => {
  const response = await api.post(`/tasks/${id}/complete`);
  return response.data;
};

/*** PROGRESS ***/
export const getDailyProgress = async () => {
  const response = await api.get("/daily-progress");
  return response.data;
};

export const getStreak = async () => {
  const response = await api.get("/streak");
  return response.data;
};

/*** ACTIVITY & ACHIEVEMENTS ***/
export const getActivity = async () => {
  const response = await api.get("/activity");
  return response.data;
};

export const getAchievements = async () => {
  const response = await api.get("/achievements");
  return response.data;
};

/*** LEADERBOARD ***/
export const getLeaderboard = async () => {
  const response = await api.get("/leaderboard");
  return response.data;
};

/*** RECOMMENDATIONS ***/
export const getRecommendations = async (limit?: number) => {
  const response = await api.get("/recommendations", { params: { limit } });
  return response.data;
};

/*** SEED DATA ***/
export const seedDemoData = async () => {
  const response = await api.post("/seed");
  return response.data;
};
