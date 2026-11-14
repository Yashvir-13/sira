import { apiClient } from './client';
import type {
  SignupStep1Request,
  SignupStep1Response,
  SignupStep2Request,
  SigninRequest,
  SigninResponse,
  UserResponse,
} from '../types';

export const authApi = {
  signupStep1: async (data: SignupStep1Request): Promise<SignupStep1Response> => {
    const res = await apiClient.post<SignupStep1Response>('/auth/signup/step1', data);
    return res.data;
  },

  signupStep2: async (data: SignupStep2Request): Promise<UserResponse> => {
    const res = await apiClient.post<UserResponse>('/auth/signup/step2', data);
    return res.data;
  },

  signin: async (data: SigninRequest): Promise<SigninResponse> => {
    const res = await apiClient.post<SigninResponse>('/auth/signin', data);
    return res.data;
  },

  getMe: async (): Promise<UserResponse> => {
    const res = await apiClient.get<UserResponse>('/auth/me');
    return res.data;
  },
};
