import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import Chat from '../chat/Chat';
import CodeEditor from './CodeEditor';
import LivePreview from '../preview/LivePreview';
import { AiOutlineLayout, AiOutlineCode, AiOutlineEye, AiOutlineMessage, AiOutlineSplit } from 'react-icons/ai';

type LayoutMode = 'split' | 'editor' | 'preview' | 'chat';

const ProjectEditor = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  const { currentProject, isLoading } = useAppSelector((state) => state.projects);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split');
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // percentage

  useEffect(() => {
    if (projectId) {
      // Load project data
      // dispatch(loadProject(projectId));
    }
  }, [projectId, dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!projectId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <p className="text-lg mb-2">No project selected</p>
          <p className="text-sm">Please select or create a project to continue</p>
        </div>
      </div>
    );
  }

  const renderLayout = () => {
    switch (layoutMode) {
      case 'chat':
        return (
          <div className="h-full">
            <Chat projectId={projectId} />
          </div>
        );
      case 'editor':
        return (
          <div className="h-full">
            <CodeEditor projectId={projectId} />
          </div>
        );
      case 'preview':
        return (
          <div className="h-full">
            <LivePreview projectId={projectId} />
          </div>
        );
      case 'split':
      default:
        return (
          <div className="flex h-full gap-4">
            {/* Left Panel - Chat */}
            <div className="w-80 flex-shrink-0">
              <Chat projectId={projectId} />
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Top Section - Code Editor */}
              <div className="flex-1">
                <CodeEditor projectId={projectId} />
              </div>
              
              {/* Bottom Section - Live Preview */}
              <div className="h-80">
                <LivePreview projectId={projectId} />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header with layout controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            {currentProject?.name || 'Untitled Project'}
          </h1>
          {currentProject?.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md truncate">
              {currentProject.description}
            </p>
          )}
        </div>

        {/* Layout Mode Selector */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setLayoutMode('split')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
              layoutMode === 'split'
                ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
            }`}
            title="Split view"
          >
            <AiOutlineSplit size={16} />
            <span className="hidden sm:inline">Split</span>
          </button>
          <button
            onClick={() => setLayoutMode('chat')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
              layoutMode === 'chat'
                ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
            }`}
            title="Chat only"
          >
            <AiOutlineMessage size={16} />
            <span className="hidden sm:inline">Chat</span>
          </button>
          <button
            onClick={() => setLayoutMode('editor')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
              layoutMode === 'editor'
                ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
            }`}
            title="Code editor only"
          >
            <AiOutlineCode size={16} />
            <span className="hidden sm:inline">Code</span>
          </button>
          <button
            onClick={() => setLayoutMode('preview')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
              layoutMode === 'preview'
                ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
            }`}
            title="Preview only"
          >
            <AiOutlineEye size={16} />
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {renderLayout()}
      </div>
    </div>
  );
};

export default ProjectEditor;
