const apiBaseUrl = (
  import.meta.env.VITE_API_URL || 'http://localhost:3000'
).replace(/\/+$/, '');

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  HOME: '/',
} as const;

export const API_ENDPOINTS = {
  BASE: apiBaseUrl,
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: "/auth/logout",
    REGISTER: '/auth/register',
  },
  HEALTH: '/health',
} as const;

export const STORAGE_KEYS = {
  USER: 'example_user',
  TOKEN: 'example_token',
} as const;
