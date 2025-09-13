import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, ProjectFramework, ProjectType } from '@/types';

// Get theme from localStorage or default to light
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('spider-ai-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
};

const initialState: UIState = {
  theme: getInitialTheme(),
  sidebarOpen: true,
  activeTab: 'chat',
  isGenerating: false,
  currentProject: undefined,
  selectedFramework: ProjectFramework.REACT,
  selectedProjectType: ProjectType.WEBAPP,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('spider-ai-theme', action.payload);
        if (action.payload === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },

    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      if (typeof window !== 'undefined') {
        localStorage.setItem('spider-ai-theme', newTheme);
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setActiveTab: (state, action: PayloadAction<'chat' | 'code' | 'preview' | 'settings'>) => {
      state.activeTab = action.payload;
    },

    setIsGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },

    setSelectedFramework: (state, action: PayloadAction<ProjectFramework>) => {
      state.selectedFramework = action.payload;
    },

    setSelectedProjectType: (state, action: PayloadAction<ProjectType>) => {
      state.selectedProjectType = action.payload;
    },

    initializeTheme: (state) => {
      if (typeof window !== 'undefined') {
        if (state.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  setActiveTab,
  setIsGenerating,
  setSelectedFramework,
  setSelectedProjectType,
  initializeTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
