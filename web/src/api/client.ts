import axios from 'axios';
import type { ChartRequest, ChartResponse, DashaResponse } from '../../../shared/types/chart';
import type { AnalysisResponse } from '../../../shared/types/analysis';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

export const calculateChart = (data: ChartRequest) =>
  api.post<ChartResponse>('/api/chart', data);

export const calculateDasha = (data: ChartRequest) =>
  api.post<DashaResponse>('/api/dasha', data);

export const getAnalysis = (data: ChartRequest) =>
  api.post<AnalysisResponse>('/api/analysis', data);

export const searchLocation = (q: string) =>
  api.get<{ display_name: string; latitude: number; longitude: number }[]>(
    `/api/geo/search?q=${encodeURIComponent(q)}`
  );

export const getAyanamsaList = () =>
  api.get<{ id: string; label: string; description: string }[]>('/api/settings/ayanamsa');

export default api;
