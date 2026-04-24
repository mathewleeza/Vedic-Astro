import { create } from 'zustand';
import type { ChartRequest, ChartResponse, DashaResponse } from '../../../shared/types/chart';
import type { AnalysisResponse } from '../../../shared/types/analysis';
import { calculateChart, calculateDasha, getAnalysis } from '../api/client';

interface ChartStore {
  chartRequest: ChartRequest | null;
  chartResponse: ChartResponse | null;
  dashaResponse: DashaResponse | null;
  analysisResponse: AnalysisResponse | null;
  isLoading: boolean;
  error: string | null;
  setRequest: (req: ChartRequest) => void;
  fetchAll: (req: ChartRequest) => Promise<void>;
}

export const useChartStore = create<ChartStore>((set) => ({
  chartRequest: null,
  chartResponse: null,
  dashaResponse: null,
  analysisResponse: null,
  isLoading: false,
  error: null,

  setRequest: (req) => set({ chartRequest: req }),

  fetchAll: async (req) => {
    set({ isLoading: true, error: null, chartRequest: req });
    try {
      const [chartRes, dashaRes, analysisRes] = await Promise.all([
        calculateChart(req),
        calculateDasha(req),
        getAnalysis(req),
      ]);
      set({
        chartResponse: chartRes.data,
        dashaResponse: dashaRes.data,
        analysisResponse: analysisRes.data,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      set({ error: message, isLoading: false });
    }
  },
}));
