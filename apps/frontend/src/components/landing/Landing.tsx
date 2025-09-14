import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { startNewConversation } from '@/store/slices/chatSlice';
import { AiOutlineRocket, AiOutlineCode, AiOutlineEye, AiOutlineThunderbolt } from 'react-icons/ai';
import { FiArrowRight, FiStar, FiPlay, FiGithub } from 'react-icons/fi';
import Chat from '../chat/Chat';
import CodeEditor from '../editor/CodeEditor';
import LivePreview from '../preview/LivePreview';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, promptCount } = useAppSelector((state) => state.auth);
  const { currentConversation } = useAppSelector((state) => state.chat);
  const [showTryDemo, setShowTryDemo] = useState(false);
  const [demoProjectId] = useState('demo-project');

  useEffect(() => {
    // Start a demo conversation for unauthenticated users
    if (!isAuthenticated && !currentConversation) {
      dispatch(startNewConversation({ projectId: demoProjectId }));
    }
  }, [isAuthenticated, currentConversation, dispatch, demoProjectId]);

  const handleTryDemo = () => {
    if (promptCount >= 5) {
      navigate('/auth/register');
    } else {
      setShowTryDemo(true);
      if (!currentConversation) {
        dispatch(startNewConversation({ projectId: demoProjectId }));
      }
    }
  };

  const handleSignUp = () => {
    navigate('/auth/register');
  };

  const handleLogin = () => {
    navigate('/auth/login');
  };

  const features = [
    {
      icon: <AiOutlineRocket />,
      title: 'AI-Powered Generation',
      description: 'Generate complete full-stack applications from natural language descriptions'
    },
    {
      icon: <AiOutlineCode />,
      title: 'Multiple Frameworks',
      description: 'Support for React, Vue, Angular, Next.js, and more modern frameworks'
    },
    {
      icon: <AiOutlineEye />,
      title: 'Live Preview',
      description: 'See your application come to life with real-time preview and editing'
    },
    {
      icon: <AiOutlineThunderbolt />,
      title: 'Production Ready',
      description: 'Generate deployment-ready code with best practices and modern tooling'
    }
  ];

  const examples = [
    'Create a todo app with authentication',
    'Build a blog with comment system',
    'Make an e-commerce store',
    'Design a social media dashboard',
    'Create a real estate platform'
  ];

  if (showTryDemo) {
    return (
      <div className="h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">🕷️ Spider AI</h1>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                Demo Mode
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {5 - promptCount} free prompts remaining
              </span>
              <button
                onClick={handleSignUp}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Up for Full Access
              </button>
            </div>
          </div>
        </div>

        {/* Demo Interface */}
        <div className="flex h-[calc(100vh-73px)] gap-4 p-4">
          {/* Left Panel - Chat */}
          <div className="w-80 flex-shrink-0">
            <Chat projectId={demoProjectId} />
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Top Section - Code Editor */}
            <div className="flex-1">
              <CodeEditor projectId={demoProjectId} />
            </div>
            
            {/* Bottom Section - Live Preview */}
            <div className="h-80">
              <LivePreview projectId={demoProjectId} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Navigation */}
      <nav className="relative z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">🕷️ Spider AI</h1>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">by Samrat Industries</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/app/dashboard')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Generate Full-Stack Apps
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> with AI</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Describe your web application in plain English, and Spider AI will generate complete, 
            production-ready code with frontend, backend, and database - all in seconds.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={handleTryDemo}
              className="group bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 text-lg font-medium"
            >
              <FiPlay />
              Try Free Demo
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleSignUp}
              className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-lg font-medium"
            >
              Get Started Free
            </button>
          </div>

          {/* Prompt Examples */}
          <div className="mb-12">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Try these example prompts:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleTryDemo();
                    // TODO: Pre-fill chat with this example
                  }}
                  className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">5+</div>
              <div className="text-gray-600 dark:text-gray-400">Frameworks Supported</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">&lt; 2min</div>
              <div className="text-gray-600 dark:text-gray-400">Average Generation Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">95%</div>
              <div className="text-gray-600 dark:text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Build Modern Apps
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              From idea to deployment in minutes, not months
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl text-blue-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Build Your Next App?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Start with 5 free generations. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleTryDemo}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Try Free Demo
            </button>
            <a
              href="https://github.com/mrsaurabh009/Spider-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-lg font-medium flex items-center gap-2 justify-center"
            >
              <FiGithub />
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">🕷️ Spider AI</h3>
            <p className="text-gray-400 mb-4">
              AI-Powered Full-Stack Web Development Platform
            </p>
            <p className="text-gray-500 text-sm">
              Built by Samrat Industries & Technologies • Open Source MIT License
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
