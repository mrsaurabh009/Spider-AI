import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditorState, EditorFile } from '@/types';
import { generateCode, refineCode } from './chatSlice';

const initialState: EditorState = {
  files: [],
  activeFileIndex: 0,
  theme: 'vs-dark',
  fontSize: 14,
  tabSize: 2,
  wordWrap: true,
  minimap: false,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    // File management
    addFile: (state, action: PayloadAction<EditorFile>) => {
      state.files.push(action.payload);
      state.activeFileIndex = state.files.length - 1;
    },

    removeFile: (state, action: PayloadAction<number>) => {
      if (state.files.length > 1) {
        state.files.splice(action.payload, 1);
        if (state.activeFileIndex >= action.payload && state.activeFileIndex > 0) {
          state.activeFileIndex--;
        }
      }
    },

    setActiveFile: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.files.length) {
        // Mark previous active file as inactive
        if (state.files[state.activeFileIndex]) {
          state.files[state.activeFileIndex].isActive = false;
        }
        
        // Set new active file
        state.activeFileIndex = action.payload;
        state.files[action.payload].isActive = true;
      }
    },

    updateFileContent: (state, action: PayloadAction<{ index: number; content: string }>) => {
      const { index, content } = action.payload;
      if (state.files[index]) {
        state.files[index].content = content;
        state.files[index].isModified = true;
      }
    },

    saveFile: (state, action: PayloadAction<number>) => {
      if (state.files[action.payload]) {
        state.files[action.payload].isModified = false;
      }
    },

    saveAllFiles: (state) => {
      state.files.forEach(file => {
        file.isModified = false;
      });
    },

    // Editor settings
    setTheme: (state, action: PayloadAction<'vs-light' | 'vs-dark'>) => {
      state.theme = action.payload;
    },

    setFontSize: (state, action: PayloadAction<number>) => {
      state.fontSize = Math.max(8, Math.min(32, action.payload));
    },

    setTabSize: (state, action: PayloadAction<number>) => {
      state.tabSize = Math.max(1, Math.min(8, action.payload));
    },

    setWordWrap: (state, action: PayloadAction<boolean>) => {
      state.wordWrap = action.payload;
    },

    setMinimap: (state, action: PayloadAction<boolean>) => {
      state.minimap = action.payload;
    },

    // Utility actions
    clearFiles: (state) => {
      state.files = [];
      state.activeFileIndex = 0;
    },

    resetEditor: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    // Handle code generation
    builder.addCase(generateCode.fulfilled, (state, action) => {
      const { generatedCode } = action.payload;
      const newFiles: EditorFile[] = [];

      // Add main frontend file
      if (generatedCode.frontend) {
        const extension = generatedCode.framework === 'VUE' ? '.vue' : '.tsx';
        newFiles.push({
          path: `src/App${extension}`,
          content: generatedCode.frontend,
          language: generatedCode.framework === 'VUE' ? 'vue' : 'typescript',
          isModified: false,
          isActive: true,
        });
      }

      // Add backend file if available
      if (generatedCode.backend) {
        newFiles.push({
          path: 'server/index.ts',
          content: generatedCode.backend,
          language: 'typescript',
          isModified: false,
          isActive: false,
        });
      }

      // Add database schema if available
      if (generatedCode.database) {
        newFiles.push({
          path: 'prisma/schema.prisma',
          content: generatedCode.database,
          language: 'prisma',
          isModified: false,
          isActive: false,
        });
      }

      // Add package.json
      if (generatedCode.packageJson) {
        newFiles.push({
          path: 'package.json',
          content: JSON.stringify(generatedCode.packageJson, null, 2),
          language: 'json',
          isModified: false,
          isActive: false,
        });
      }

      // Add additional files
      generatedCode.files.forEach((file: any) => {
        const language = getLanguageFromPath(file.path);
        newFiles.push({
          path: file.path,
          content: file.content,
          language,
          isModified: false,
          isActive: false,
        });
      });

      // Replace current files
      state.files = newFiles;
      state.activeFileIndex = 0;
      
      // Mark first file as active
      if (state.files.length > 0) {
        state.files[0].isActive = true;
      }
    });

    // Handle code refinement
    builder.addCase(refineCode.fulfilled, (state, action) => {
      const { generatedCode } = action.payload;
      
      // Update existing files with refined code
      if (generatedCode.frontend && state.files[0]) {
        state.files[0].content = generatedCode.frontend;
        state.files[0].isModified = true;
      }

      if (generatedCode.backend) {
        const backendFileIndex = state.files.findIndex(f => f.path.includes('server') || f.path.includes('backend'));
        if (backendFileIndex !== -1) {
          state.files[backendFileIndex].content = generatedCode.backend;
          state.files[backendFileIndex].isModified = true;
        }
      }

      if (generatedCode.database) {
        const dbFileIndex = state.files.findIndex(f => f.path.includes('prisma') || f.path.includes('schema'));
        if (dbFileIndex !== -1) {
          state.files[dbFileIndex].content = generatedCode.database;
          state.files[dbFileIndex].isModified = true;
        }
      }
    });
  },
});

// Helper function to determine language from file path
function getLanguageFromPath(path: string): string {
  const extension = path.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'vue':
      return 'vue';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'scss':
    case 'sass':
      return 'scss';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    case 'yml':
    case 'yaml':
      return 'yaml';
    case 'sql':
      return 'sql';
    case 'prisma':
      return 'prisma';
    case 'py':
      return 'python';
    case 'go':
      return 'go';
    case 'rs':
      return 'rust';
    case 'php':
      return 'php';
    case 'rb':
      return 'ruby';
    case 'java':
      return 'java';
    case 'c':
      return 'c';
    case 'cpp':
    case 'cc':
    case 'cxx':
      return 'cpp';
    case 'cs':
      return 'csharp';
    case 'sh':
    case 'bash':
      return 'shell';
    case 'dockerfile':
      return 'dockerfile';
    default:
      return 'plaintext';
  }
}

export const {
  addFile,
  removeFile,
  setActiveFile,
  updateFileContent,
  saveFile,
  saveAllFiles,
  setTheme,
  setFontSize,
  setTabSize,
  setWordWrap,
  setMinimap,
  clearFiles,
  resetEditor,
} = editorSlice.actions;

export default editorSlice.reducer;
