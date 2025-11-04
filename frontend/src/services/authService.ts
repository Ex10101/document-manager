import api from '../utils/api';

export interface RegisterData {
  username: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
  };
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
