import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PreviewState } from '@/types';

const initialState: PreviewState = {
  isVisible: true,
  mode: 'split',
  url: '',
  isLoading: false,
  error: null,
  zoom: 100,
  autoRefresh: true,
  refreshInterval: 1000,
  lastRefresh: null,
  consoleOutput: [],
  networkRequests: [],
  performanceMetrics: null,
};

const previewSlice = createSlice({
  name: 'preview',
  initialState,
  reducers: {
    setVisibility: (state, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload;
    },
    
    setMode: (state, action: PayloadAction<'split' | 'fullscreen' | 'hidden'>) => {
      state.mode = action.payload;
      if (action.payload === 'hidden') {
        state.isVisible = false;
      } else {
        state.isVisible = true;
      }
    },
    
    setUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = Math.max(10, Math.min(500, action.payload));
    },
    
    zoomIn: (state) => {
      state.zoom = Math.min(500, state.zoom + 25);
    },
    
    zoomOut: (state) => {
      state.zoom = Math.max(10, state.zoom - 25);
    },
    
    resetZoom: (state) => {
      state.zoom = 100;
    },
    
    setAutoRefresh: (state, action: PayloadAction<boolean>) => {
      state.autoRefresh = action.payload;
    },
    
    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = Math.max(100, action.payload);
    },
    
    updateLastRefresh: (state) => {
      state.lastRefresh = new Date().toISOString();
    },
    
    addConsoleOutput: (state, action: PayloadAction<{
      type: 'log' | 'error' | 'warn' | 'info';
      message: string;
      timestamp: string;
      source?: string;
    }>) => {
      state.consoleOutput.push(action.payload);
      // Keep only last 100 entries
      if (state.consoleOutput.length > 100) {
        state.consoleOutput = state.consoleOutput.slice(-100);
      }
    },
    
    clearConsoleOutput: (state) => {
      state.consoleOutput = [];
    },
    
    addNetworkRequest: (state, action: PayloadAction<{
      id: string;
      method: string;
      url: string;
      status?: number;
      duration?: number;
      timestamp: string;
      size?: number;
    }>) => {
      state.networkRequests.push(action.payload);
      // Keep only last 50 entries
      if (state.networkRequests.length > 50) {
        state.networkRequests = state.networkRequests.slice(-50);
      }
    },
    
    updateNetworkRequest: (state, action: PayloadAction<{
      id: string;
      updates: Partial<{
        status: number;
        duration: number;
        size: number;
      }>;
    }>) => {
      const request = state.networkRequests.find(r => r.id === action.payload.id);
      if (request) {
        Object.assign(request, action.payload.updates);
      }
    },
    
    clearNetworkRequests: (state) => {
      state.networkRequests = [];
    },
    
    setPerformanceMetrics: (state, action: PayloadAction<{
      loadTime?: number;
      renderTime?: number;
      memoryUsage?: number;
      bundleSize?: number;
    } | null>) => {
      state.performanceMetrics = action.payload;
    },
    
    refresh: (state) => {
      state.isLoading = true;
      state.error = null;
      state.lastRefresh = new Date().toISOString();
    },
  },
});

export const {
  setVisibility,
  setMode,
  setUrl,
  setLoading,
  setError,
  clearError,
  setZoom,
  zoomIn,
  zoomOut,
  resetZoom,
  setAutoRefresh,
  setRefreshInterval,
  updateLastRefresh,
  addConsoleOutput,
  clearConsoleOutput,
  addNetworkRequest,
  updateNetworkRequest,
  clearNetworkRequests,
  setPerformanceMetrics,
  refresh,
} = previewSlice.actions;

export default previewSlice.reducer;
