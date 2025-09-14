import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditorState, EditorFile } from '@/types';
import { generateCode, refineCode } from './chatSlice';

const initialState: EditorState = {
  files: [],
  activeFileId: null,
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
    createFile: (state, action: PayloadAction<{ projectId: string; name: string; content: string; type: string }>) => {
      const newFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: action.payload.name,
        content: action.payload.content,
        language: action.payload.type,
        modified: false,
      };
      state.files.push(newFile);
      state.activeFileId = newFile.id;
    },

    removeFile: (state, action: PayloadAction<string>) => {
      const fileIndex = state.files.findIndex(f => f.id === action.payload);
      if (fileIndex !== -1 && state.files.length > 1) {
        state.files.splice(fileIndex, 1);
        if (state.activeFileId === action.payload) {
          state.activeFileId = state.files[0]?.id || null;
        }
      }
    },

    selectFile: (state, action: PayloadAction<string>) => {
      const file = state.files.find(f => f.id === action.payload);
      if (file) {
        state.activeFileId = action.payload;
      }
    },

    updateFileContent: (state, action: PayloadAction<{ fileId: string; content: string }>) => {
      const { fileId, content } = action.payload;
      const file = state.files.find(f => f.id === fileId);
      if (file) {
        file.content = content;
        file.modified = true;
      }
    },

    saveFile: (state, action: PayloadAction<string>) => {
      const file = state.files.find(f => f.id === action.payload);
      if (file) {
        file.modified = false;
      }
    },

    saveAllFiles: (state) => {
      state.files.forEach(file => {
        file.modified = false;
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
      state.activeFileId = null;
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
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: `App${extension}`,
          content: generatedCode.frontend,
          language: generatedCode.framework === 'VUE' ? 'vue' : 'typescript',
          modified: false,
        });
      }

      // Add backend file if available
      if (generatedCode.backend) {
        newFiles.push({
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: 'server.ts',
          content: generatedCode.backend,
          language: 'typescript',
          modified: false,
        });
      }

      // Add database schema if available
      if (generatedCode.database) {
        newFiles.push({
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: 'schema.prisma',
          content: generatedCode.database,
          language: 'prisma',
          modified: false,
        });
      }

      // Add package.json
      if (generatedCode.packageJson) {
        newFiles.push({
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: 'package.json',
          content: JSON.stringify(generatedCode.packageJson, null, 2),
          language: 'json',
          modified: false,
        });
      }

      // Add additional files
      if (generatedCode.files) {
        generatedCode.files.forEach((file: any) => {
          const language = getLanguageFromPath(file.name);
          newFiles.push({
            id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            content: file.content,
            language,
            modified: false,
          });
        });
      }

      // Replace current files
      state.files = newFiles;
      state.activeFileId = newFiles.length > 0 ? newFiles[0].id : null;
    });

    // Handle code refinement
    builder.addCase(refineCode.fulfilled, (state, action) => {
      const { generatedCode } = action.payload;
      
      // Update existing files with refined code
      if (generatedCode.frontend && state.files.length > 0) {
        state.files[0].content = generatedCode.frontend;
        state.files[0].modified = true;
      }

      if (generatedCode.backend) {
        const backendFile = state.files.find(f => f.name.includes('server') || f.name.includes('backend'));
        if (backendFile) {
          backendFile.content = generatedCode.backend;
          backendFile.modified = true;
        }
      }

      if (generatedCode.database) {
        const dbFile = state.files.find(f => f.name.includes('prisma') || f.name.includes('schema'));
        if (dbFile) {
          dbFile.content = generatedCode.database;
          dbFile.modified = true;
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
  createFile,
  removeFile,
  selectFile,
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
