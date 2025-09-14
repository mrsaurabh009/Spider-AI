import { useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { sendMessage, clearChat } from '@/store/slices/chatSlice';
import { AiOutlineSend, AiOutlineClear, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiChevronDown } from 'react-icons/fi';
import ChatMessage from './ChatMessage';

interface ChatProps {
  projectId: string;
}

const Chat: React.FC<ChatProps> = ({ projectId }) => {
  const dispatch = useAppDispatch();
  const { messages, isLoading } = useAppSelector((state) => state.chat);
  const { promptCount, isAuthenticated } = useAppSelector((state) => state.auth);
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showPromptLimit, setShowPromptLimit] = useState(false);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Show prompt limit warning when count reaches 4
  useEffect(() => {
    if (!isAuthenticated && promptCount >= 4) {
      setShowPromptLimit(true);
    }
  }, [promptCount, isAuthenticated]);

  const handleSendMessage = () => {
    if (input.trim() && !isLoading) {
      dispatch(sendMessage({ projectId, message: input.trim() }));
      setInput('');
    }
  };

  const handleClearChat = () => {
    dispatch(clearChat());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">AI Assistant</h2>
        <button
          onClick={handleClearChat}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          title="Clear chat"
        >
          <AiOutlineClear size={20} />
        </button>
      </div>

      {/* Chat messages container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p className="text-center mb-2">
              Describe your web application, and I'll generate the code for you!
            </p>
            <p className="text-sm text-center">
              For example: "Create a todo app with authentication" or "Build a blog with a comment system"
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))
        )}

        {isLoading && (
          <div className="flex justify-center py-2">
            <AiOutlineLoading3Quarters className="animate-spin text-blue-500" size={24} />
          </div>
        )}

        {/* Prompt limit warning */}
        {showPromptLimit && !isAuthenticated && (
          <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg mb-4">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              You've used {promptCount}/5 free prompts. Sign up to continue using Spider AI after your free prompts are used.
            </p>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your web application..."
            className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
            rows={3}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 bottom-2 p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
          >
            <AiOutlineSend size={20} />
          </button>
        </div>

        {/* Scroll to bottom button - shows when scrolled up */}
        <button
          onClick={() => {
            if (chatContainerRef.current) {
              chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
          }}
          className="absolute bottom-20 right-8 bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 opacity-70 hover:opacity-100 transition-opacity"
        >
          <FiChevronDown size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
