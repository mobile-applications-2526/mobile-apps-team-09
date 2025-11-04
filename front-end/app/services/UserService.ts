import api from './apiService';

interface LoginResponse {
    access_token: string,
    token_type: string
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', { username, password });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401 || (data && data.message?.toLowerCase().includes('invalid'))) {
        throw new Error('Login failed: Invalid username or password');
      }
      throw new Error(`Login failed: ${status}`);
    } else {
      throw new Error('Login failed: Network error');
    }
  }
};
