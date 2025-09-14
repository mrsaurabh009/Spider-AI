// Base Types
export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  plan: UserPlan;
  tokensUsed: number;
  tokensLimit: number;
  createdAt: string;
  lastLoginAt?: string;
}

export enum UserPlan {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

export enum ProjectFramework {
  REACT = 'REACT',
  NEXTJS = 'NEXTJS',
  VUE = 'VUE',
  NUXT = 'NUXT',
  ANGULAR = 'ANGULAR',
  SVELTE = 'SVELTE',
  VANILLA = 'VANILLA'
}

export enum ProjectType {
  WEBAPP = 'webapp',
  DASHBOARD = 'dashboard',
  ECOMMERCE = 'ecommerce',
  BLOG = 'blog',
  PORTFOLIO = 'portfolio',
  LANDING = 'landing',
  SAAS = 'saas',
  MOBILE = 'mobile',
  API = 'api',
  CMS = 'cms',
  COMPONENT = 'component',
  CUSTOM = 'custom'
}

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  framework: ProjectFramework;
  template?: string;
  frontendCode?: string;
  backendCode?: string;
  databaseSchema?: string;
  status: ProjectStatus;
  isPublic: boolean;
  deploymentUrl?: string;
  deploymentProvider?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface GeneratedCode {
  framework: ProjectFramework;
  frontend: string;
  backend?: string;
  database?: string;
  packageJson: any;
  files: GeneratedFile[];
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  timestamp: string;
}

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface CodeGenerationRequest {
  prompt: string;
  framework: ProjectFramework;
  type: ProjectType;
  context?: {
    existingCode?: string;
    requirements?: string[];
    constraints?: string[];
    style?: 'modern' | 'minimal' | 'corporate' | 'creative';
    features?: string[];
  };
  includeBackend?: boolean;
  includeDatabase?: boolean;
  includeAuth?: boolean;
  includeTests?: boolean;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  tokens?: number;
  model?: string;
  generatedCode?: GeneratedCode;
  isTyping?: boolean;
}

export interface Conversation {
  id: string;
  title?: string;
  messages: ChatMessage[];
  projectId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// UI State Types
export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  activeTab: 'chat' | 'code' | 'preview' | 'settings';
  isGenerating: boolean;
  currentProject?: Project;
  selectedFramework: ProjectFramework;
  selectedProjectType: ProjectType;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    statusCode?: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Editor Types
export interface EditorFile {
  id: string;
  name: string;
  content: string;
  language: string;
  modified: boolean;
}

export interface EditorState {
  files: EditorFile[];
  activeFileId: string | null;
  theme: 'vs-light' | 'vs-dark';
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
}

// Preview Types
export interface PreviewState {
  previewUrl: string | null;
  isLoading: boolean;
  htmlContent: string | null;
  cssContent: string | null;
  jsContent: string | null;
}

// Export Types
export enum ExportType {
  ZIP = 'ZIP',
  GITHUB_REPO = 'GITHUB_REPO',
  DOCKER = 'DOCKER'
}

export interface ExportOptions {
  type: ExportType;
  includeDatabase: boolean;
  includeAssets: boolean;
  projectName?: string;
  githubRepo?: {
    name: string;
    description?: string;
    isPrivate: boolean;
  };
}

export interface ExportResult {
  type: ExportType;
  downloadUrl?: string;
  githubUrl?: string;
  dockerImage?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

// Socket Types
export interface SocketMessage {
  type: 'generation-progress' | 'code-updated' | 'user-joined' | 'user-left';
  data: any;
  timestamp: string;
  userId?: string;
}

// Template Types
export interface Template {
  id: string;
  name: string;
  description?: string;
  category: string;
  framework: ProjectFramework;
  tags: string[];
  useCount: number;
  rating: number;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
  thumbnail?: string;
  frontendCode: string;
  backendCode?: string;
  databaseSchema?: string;
}

// Analytics Types
export interface UsageStats {
  totalProjects: number;
  totalTokensUsed: number;
  projectsByFramework: Record<ProjectFramework, number>;
  generationsThisMonth: number;
  averageGenerationTime: number;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Form Types
export interface CreateProjectForm {
  name: string;
  description?: string;
  framework: ProjectFramework;
  type: ProjectType;
  isPublic: boolean;
}

export interface GenerateCodeForm {
  prompt: string;
  framework: ProjectFramework;
  type: ProjectType;
  includeBackend: boolean;
  includeDatabase: boolean;
  includeAuth: boolean;
  includeTests: boolean;
  style: 'modern' | 'minimal' | 'corporate' | 'creative';
  features: string[];
  requirements: string[];
  constraints: string[];
}

// Component Props Types
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

// Hook Types
export interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: AppError) => void;
  retry?: number;
  retryDelay?: number;
}

export interface UseWebSocketOptions {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: (message: SocketMessage) => void;
  autoReconnect?: boolean;
}

// Store Types (Redux)
export interface RootState {
  auth: AuthState;
  projects: ProjectsState;
  chat: ChatState;
  editor: EditorState;
  preview: PreviewState;
  ui: UIState;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  promptCount: number;
}

export interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Event Types
export type EventHandler<T = any> = (event: T) => void;

export type AsyncEventHandler<T = any> = (event: T) => Promise<void>;
