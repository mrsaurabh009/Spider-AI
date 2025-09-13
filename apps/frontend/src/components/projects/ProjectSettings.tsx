import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectSettings: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Project Settings
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Project ID: {projectId}
      </p>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Project settings coming soon...
      </p>
    </div>
  );
};

export default ProjectSettings;
