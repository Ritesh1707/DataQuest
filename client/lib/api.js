const API_URL = 'http://localhost:3001/api';

async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    data = await response.json();
  } else {
    data = { message: await response.text() };
  }

  if (!response.ok) {
    throw new Error(data.message || 'API Error');
  }
  return data;
}

export const api = {
  login: (email, password) => fetchWithAuth('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  register: (email, password, name) => fetchWithAuth('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  }),
  getCourses: () => fetchWithAuth('/content/courses'),
  getLesson: (id) => fetchWithAuth(`/content/lessons/${id}`),
  submitExercise: (exerciseId, code) => fetchWithAuth('/content/exercises/submit', {
    method: 'POST',
    body: JSON.stringify({ exerciseId, code }),
  }),
  getLeaderboard: () => fetchWithAuth('/gamification/leaderboard'),
  getUserRank: () => fetchWithAuth('/gamification/my-rank'),
  getAchievements: () => fetchWithAuth('/gamification/achievements'),
  getStats: () => fetchWithAuth('/gamification/stats'),
  getQuiz: (id) => fetchWithAuth(`/quizzes/${id}`),
  submitQuiz: (id, answers) => fetchWithAuth(`/quizzes/${id}/submit`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
  }),
  getMe: () => fetchWithAuth('/auth/me'),
};
