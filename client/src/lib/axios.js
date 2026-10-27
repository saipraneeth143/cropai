import axios from 'axios';
import { supabase } from './supabase';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Supabase JWT to every request
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Unwrap response data; reject with error body
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errData = error.response?.data || { error: error.message || 'Network error' };
    return Promise.reject(errData);
  }
);

// Convenience wrappers matching the api.get / api.post / api.delete usage pattern
// Already provided by axios; this file re-exports the instance directly.
