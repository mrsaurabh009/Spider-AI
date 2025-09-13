import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { ChatState, ChatMessage, Conversation, GeneratedCode, CodeGenerationRequest } from '@/types';
import { chatAPI } from '@/services/api';

// Initial state
const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  isLoading: false,
  isGenerating: false,
  error: null,
};

// Async thunks
export const generateCode = createAsyncThunk(
  'chat/generateCode',
  async (request: CodeGenerationRequest, { rejectWithValue }) => {
    try {
      const response = await chatAPI.generateCode(request);
      return {
        generatedCode: response.data,
        request,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to generate code');
    }
  }
);

export const refineCode = createAsyncThunk(
  'chat/refineCode',
  async (
    { existingCode, refinementRequest, context }: 
    { existingCode: GeneratedCode; refinementRequest: string; context?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await chatAPI.refineCode({ existingCode, refinementRequest, context });
      return {
        generatedCode: response.data,
        refinementRequest,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to refine code');
    }
  }
);

export const generateComponent = createAsyncThunk(
  'chat/generateComponent',
  async (
    { componentRequest, framework, context }:
    { componentRequest: string; framework: string; context?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await chatAPI.generateComponent({ componentRequest, framework, context });
      return {
        code: response.data.code,
        usage: response.data.usage,
        componentRequest,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to generate component');
    }
  }
);

export const explainCode = createAsyncThunk(
  'chat/explainCode',
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await chatAPI.explainCode({ code });
      return {
        explanation: response.data.explanation,
        usage: response.data.usage,
        code,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to explain code');
    }
  }
);

// Chat slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Start new conversation
    startNewConversation: (state, action: PayloadAction<{ projectId?: string }>) => {
      const newConversation: Conversation = {
        id: uuidv4(),
        title: undefined,
        messages: [],
        projectId: action.payload.projectId,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      state.conversations.unshift(newConversation);
      state.currentConversation = newConversation;
      state.error = null;
    },

    // Set active conversation
    setActiveConversation: (state, action: PayloadAction<string>) => {
      const conversation = state.conversations.find(c => c.id === action.payload);
      if (conversation) {
        state.currentConversation = conversation;
        state.error = null;
      }
    },

    // Add message to current conversation
    addMessage: (state, action: PayloadAction<Omit<ChatMessage, 'id' | 'timestamp'>>) => {
      if (state.currentConversation) {
        const message: ChatMessage = {
          ...action.payload,
          id: uuidv4(),
          timestamp: new Date().toISOString(),
        };
        
        state.currentConversation.messages.push(message);
        state.currentConversation.updatedAt = new Date().toISOString();
        
        // Update title if this is the first user message
        if (!state.currentConversation.title && message.role === 'user') {
          state.currentConversation.title = message.content.slice(0, 50) + 
            (message.content.length > 50 ? '...' : '');
        }
        
        // Update conversation in the list
        const conversationIndex = state.conversations.findIndex(
          c => c.id === state.currentConversation?.id
        );
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex] = state.currentConversation;
        }
      }
    },

    // Update message (for typing indicators, etc.)
    updateMessage: (state, action: PayloadAction<{ messageId: string; updates: Partial<ChatMessage> }>) => {
      if (state.currentConversation) {
        const messageIndex = state.currentConversation.messages.findIndex(
          m => m.id === action.payload.messageId
        );
        if (messageIndex !== -1) {
          state.currentConversation.messages[messageIndex] = {
            ...state.currentConversation.messages[messageIndex],
            ...action.payload.updates,
          };
        }
      }
    },

    // Delete conversation
    deleteConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter(c => c.id !== action.payload);
      if (state.currentConversation?.id === action.payload) {
        state.currentConversation = state.conversations[0] || null;
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set typing indicator
    setTypingIndicator: (state, action: PayloadAction<boolean>) => {
      if (state.currentConversation && action.payload) {
        const typingMessage: ChatMessage = {
          id: 'typing-indicator',
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString(),
          isTyping: true,
        };
        
        // Remove existing typing indicator
        state.currentConversation.messages = state.currentConversation.messages.filter(
          m => m.id !== 'typing-indicator'
        );
        
        // Add new typing indicator
        state.currentConversation.messages.push(typingMessage);
      } else if (state.currentConversation) {
        // Remove typing indicator
        state.currentConversation.messages = state.currentConversation.messages.filter(
          m => m.id !== 'typing-indicator'
        );
      }
    },
  },
  extraReducers: (builder) => {
    // Generate Code
    builder
      .addCase(generateCode.pending, (state) => {
        state.isLoading = true;
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(generateCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isGenerating = false;
        
        if (state.currentConversation) {
          // Remove typing indicator
          state.currentConversation.messages = state.currentConversation.messages.filter(
            m => m.id !== 'typing-indicator'
          );
          
          // Add assistant response with generated code
          const assistantMessage: ChatMessage = {
            id: uuidv4(),
            role: 'assistant',
            content: `I've generated a ${action.payload.request.framework} ${action.payload.request.type} application for you! Here's what I created:

**Framework**: ${action.payload.request.framework}
**Type**: ${action.payload.request.type}
**Model**: ${action.payload.generatedCode.model}
**Tokens Used**: ${action.payload.generatedCode.usage.totalTokens}

The application includes:
${action.payload.generatedCode.backend ? '• Backend API with Node.js/Express' : ''}
${action.payload.generatedCode.database ? '• Database schema' : ''}
• Frontend with modern ${action.payload.request.framework} components
• Production-ready code with TypeScript
• Responsive design with Tailwind CSS

You can view the generated code in the Code Editor tab and see the live preview in the Preview tab.`,
            timestamp: new Date().toISOString(),
            generatedCode: action.payload.generatedCode,
            tokens: action.payload.generatedCode.usage.totalTokens,
            model: action.payload.generatedCode.model,
          };
          
          state.currentConversation.messages.push(assistantMessage);
          state.currentConversation.updatedAt = new Date().toISOString();
        }
      })
      .addCase(generateCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isGenerating = false;
        state.error = action.payload as string;
        
        if (state.currentConversation) {
          // Remove typing indicator
          state.currentConversation.messages = state.currentConversation.messages.filter(
            m => m.id !== 'typing-indicator'
          );
          
          // Add error message
          const errorMessage: ChatMessage = {
            id: uuidv4(),
            role: 'assistant',
            content: `I apologize, but I encountered an error while generating your code: ${action.payload}. Please try again with a different prompt or check your connection.`,
            timestamp: new Date().toISOString(),
          };
          
          state.currentConversation.messages.push(errorMessage);
        }
      });

    // Refine Code
    builder
      .addCase(refineCode.pending, (state) => {
        state.isLoading = true;
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(refineCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isGenerating = false;
        
        if (state.currentConversation) {
          state.currentConversation.messages = state.currentConversation.messages.filter(
            m => m.id !== 'typing-indicator'
          );
          
          const assistantMessage: ChatMessage = {
            id: uuidv4(),
            role: 'assistant',
            content: `I've refined your code based on your request: "${action.payload.refinementRequest}"

**Updated Code**:
- Tokens Used: ${action.payload.generatedCode.usage.totalTokens}
- Model: ${action.payload.generatedCode.model}

The refined code has been updated in the editor. You can see the changes in the Code Editor tab.`,
            timestamp: new Date().toISOString(),
            generatedCode: action.payload.generatedCode,
            tokens: action.payload.generatedCode.usage.totalTokens,
            model: action.payload.generatedCode.model,
          };
          
          state.currentConversation.messages.push(assistantMessage);
          state.currentConversation.updatedAt = new Date().toISOString();
        }
      })
      .addCase(refineCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isGenerating = false;
        state.error = action.payload as string;
      });

    // Generate Component
    builder
      .addCase(generateComponent.pending, (state) => {
        state.isLoading = true;
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(generateComponent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isGenerating = false;
        
        if (state.currentConversation) {
          state.currentConversation.messages = state.currentConversation.messages.filter(
            m => m.id !== 'typing-indicator'
          );
          
          const assistantMessage: ChatMessage = {
            id: uuidv4(),
            role: 'assistant',
            content: `I've generated the component you requested: "${action.payload.componentRequest}"

**Generated Component**:
- Tokens Used: ${action.payload.usage.totalTokens}
- Framework: Modern React with TypeScript
- Features: Production-ready, accessible, and well-documented

\`\`\`tsx
${action.payload.code}
\`\`\`

The component is ready to use and follows best practices for modern React development.`,
            timestamp: new Date().toISOString(),
            tokens: action.payload.usage.totalTokens,
          };
          
          state.currentConversation.messages.push(assistantMessage);
          state.currentConversation.updatedAt = new Date().toISOString();
        }
      })
      .addCase(generateComponent.rejected, (state, action) => {
        state.isLoading = false;
        state.isGenerating = false;
        state.error = action.payload as string;
      });

    // Explain Code
    builder
      .addCase(explainCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(explainCode.fulfilled, (state, action) => {
        state.isLoading = false;
        
        if (state.currentConversation) {
          const assistantMessage: ChatMessage = {
            id: uuidv4(),
            role: 'assistant',
            content: `Here's an explanation of the code you provided:

${action.payload.explanation}

**Analysis Summary**:
- Tokens Used: ${action.payload.usage.totalTokens}
- Code Length: ${action.payload.code.length} characters

This explanation should help you understand how the code works and its key features.`,
            timestamp: new Date().toISOString(),
            tokens: action.payload.usage.totalTokens,
          };
          
          state.currentConversation.messages.push(assistantMessage);
          state.currentConversation.updatedAt = new Date().toISOString();
        }
      })
      .addCase(explainCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  startNewConversation,
  setActiveConversation,
  addMessage,
  updateMessage,
  deleteConversation,
  clearError,
  setTypingIndicator,
} = chatSlice.actions;

export default chatSlice.reducer;
