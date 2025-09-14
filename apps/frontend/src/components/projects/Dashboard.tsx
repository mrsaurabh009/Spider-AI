import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { startNewConversation } from '@/store/slices/chatSlice';
import { Plus, Code, Zap, Calendar, Clock } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { conversations } = useAppSelector((state) => state.chat);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const handleCreateProject = () => {
    const projectId = uuidv4();
    dispatch(startNewConversation({ projectId }));
    navigate(`/app/project/${projectId}`);
  };

  const handleStartChat = () => {
    const projectId = uuidv4();
    dispatch(startNewConversation({ projectId }));
    navigate(`/app/project/${projectId}`);
  };

  const recentProjects = conversations
    .filter(c => c.projectId)
    .slice(0, 5)
    .map(c => ({
      id: c.projectId!,
      name: c.title || 'Untitled Project',
      lastModified: c.updatedAt,
      messageCount: c.messages.length
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name || 'Developer'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Generate stunning web applications with AI-powered code generation
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg mb-4">
            <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            New Project
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start a new project with AI-generated code
          </p>
          <button 
            onClick={handleCreateProject}
            disabled={isCreatingProject}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingProject ? 'Creating...' : 'Create Project'}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg mb-4">
            <Code className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Generate Component
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Generate individual components for your projects
          </p>
          <button 
            onClick={handleCreateProject}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Generate Component
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg mb-4">
            <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            AI Chat
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Get help and generate code with AI assistant
          </p>
          <button 
            onClick={handleStartChat}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Start Chat
          </button>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Projects
          </h2>
        </div>
        <div className="p-6">
          {recentProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Code className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No projects yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Create your first project to get started
              </p>
              <button 
                onClick={handleCreateProject}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div 
                  key={project.id} 
                  onClick={() => navigate(`/app/project/${project.id}`)}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {project.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {project.messageCount} messages
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(project.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
