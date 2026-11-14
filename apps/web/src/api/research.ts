import { apiClient } from './client';
import type {
  ResearchStartRequest,
  ResearchStartResponse,
  ResearchItem,
} from '../types';

export const researchApi = {
  startResearch: async (data: ResearchStartRequest): Promise<ResearchStartResponse> => {
    const res = await apiClient.post<ResearchStartResponse>('/research/start', data);
    return res.data;
  },

  getResearchDetail: async (researchId: string): Promise<ResearchItem> => {
    const res = await apiClient.get<ResearchItem>(`/research/${researchId}`);
    return res.data;
  },

  getResearchHistory: async (): Promise<ResearchItem[]> => {
    const res = await apiClient.get<ResearchItem[]>('/research/history');
    return res.data;
  },

  getAllResearchAdmin: async (): Promise<ResearchItem[]> => {
    const res = await apiClient.get<ResearchItem[]>('/research/admin/all');
    return res.data;
  },
};
