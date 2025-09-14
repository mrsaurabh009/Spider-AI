import { useEffect, useRef, useState } from 'react';
import { Editor, Monaco } from '@monaco-editor/react';
import { useAppSelector, useAppDispatch } from '@/store';
import { updateFileContent, createFile, selectFile } from '@/store/slices/editorSlice';
import { AiOutlineFile, AiOutlineFolderOpen, AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';

interface CodeEditorProps {
  projectId: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ projectId }) => {
  const dispatch = useAppDispatch();
  const { files, activeFileId, theme: editorTheme } = useAppSelector((state) => state.editor);
  const { theme } = useAppSelector((state) => state.ui);
  const [monaco, setMonaco] = useState<Monaco | null>(null);
  const editorRef = useRef(null);

  const activeFile = files.find(file => file.id === activeFileId);

  useEffect(() => {
    if (monaco) {
      // Configure Monaco editor themes and settings
      monaco.editor.defineTheme('spider-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#1f2937',
          'editor.foreground': '#f9fafb',
        }
      });

      monaco.editor.defineTheme('spider-light', {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#ffffff',
          'editor.foreground': '#1f2937',
        }
      });
    }
  }, [monaco]);

  const handleEditorChange = (value: string | undefined) => {
    if (activeFileId && value !== undefined) {
      dispatch(updateFileContent({ fileId: activeFileId, content: value }));
    }
  };

  const handleFileSelect = (fileId: string) => {
    dispatch(selectFile(fileId));
  };

  const handleCreateFile = () => {
    const fileName = prompt('Enter file name:');
    if (fileName && fileName.trim()) {
      dispatch(createFile({ 
        projectId, 
        name: fileName.trim(),
        content: '',
        type: getFileType(fileName.trim())
      }));
    }
  };

  const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const typeMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'md': 'markdown',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'vue': 'vue',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
    };
    return typeMap[extension || ''] || 'plaintext';
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const iconColor = {
      'js': 'text-yellow-500',
      'jsx': 'text-blue-500',
      'ts': 'text-blue-600',
      'tsx': 'text-blue-600',
      'html': 'text-orange-500',
      'css': 'text-blue-400',
      'scss': 'text-pink-500',
      'json': 'text-yellow-600',
      'md': 'text-gray-600',
      'py': 'text-green-600',
      'java': 'text-red-600',
      'vue': 'text-green-500',
    }[extension || ''] || 'text-gray-500';

    return <AiOutlineFile className={iconColor} />;
  };

  return (
    <div className="flex h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* File Explorer */}
      <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <AiOutlineFolderOpen size={16} />
              Project Files
            </h3>
            <button
              onClick={handleCreateFile}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Create new file"
            >
              <AiOutlinePlus size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto h-full">
          {files.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              No files yet. Start by chatting with AI to generate code!
            </div>
          ) : (
            <div className="p-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  onClick={() => handleFileSelect(file.id)}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                    file.id === activeFileId
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {getFileIcon(file.name)}
                  <span className="text-sm truncate flex-1">{file.name}</span>
                  {file.modified && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full" title="Modified" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col">
        {activeFile ? (
          <>
            {/* File Tab */}
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
              <div className="flex items-center gap-2">
                {getFileIcon(activeFile.name)}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {activeFile.name}
                </span>
                {activeFile.modified && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <FiSettings size={14} />
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1">
              <Editor
                height="100%"
                language={activeFile.language || 'javascript'}
                value={activeFile.content}
                onChange={handleEditorChange}
                theme={theme === 'dark' ? 'spider-dark' : 'spider-light'}
                onMount={(editor, monaco) => {
                  editorRef.current = editor;
                  setMonaco(monaco);
                }}
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  renderWhitespace: 'selection',
                  bracketPairColorization: { enabled: true },
                  guides: {
                    bracketPairs: true,
                    bracketPairsHorizontal: true,
                    highlightActiveIndentation: true,
                  },
                  suggest: {
                    showKeywords: true,
                    showSnippets: true,
                  },
                  quickSuggestions: {
                    other: true,
                    comments: true,
                    strings: true,
                  },
                  parameterHints: {
                    enabled: true,
                  },
                  codeLens: true,
                  folding: true,
                  foldingStrategy: 'indentation',
                  showFoldingControls: 'mouseover',
                  smoothScrolling: true,
                  cursorBlinking: 'blink',
                  cursorSmoothCaretAnimation: true,
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <AiOutlineFile size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No file selected</p>
              <p className="text-sm">Select a file from the sidebar or generate code with AI</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
