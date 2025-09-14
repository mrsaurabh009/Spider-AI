import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/store';
import { AiOutlineReload, AiOutlineFullscreen, AiOutlineFullscreenExit, AiOutlineDesktop, AiOutlineTablet, AiOutlineMobile } from 'react-icons/ai';
import { FiExternalLink } from 'react-icons/fi';

interface LivePreviewProps {
  projectId: string;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const LivePreview: React.FC<LivePreviewProps> = ({ projectId }) => {
  const { previewUrl, isLoading, htmlContent, cssContent, jsContent } = useAppSelector((state) => state.preview);
  const { files } = useAppSelector((state) => state.editor);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const viewportSizes = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' }
  };

  useEffect(() => {
    // Update preview when files change
    updatePreview();
  }, [files]);

  const updatePreview = () => {
    if (!iframeRef.current) return;

    const htmlFile = files.find(f => f.name.endsWith('.html') || f.name === 'index.html');
    const cssFiles = files.filter(f => f.name.endsWith('.css'));
    const jsFiles = files.filter(f => f.name.endsWith('.js') || f.name.endsWith('.jsx') || f.name.endsWith('.ts') || f.name.endsWith('.tsx'));

    let htmlContent = htmlFile?.content || '<div style="padding: 20px; text-align: center; color: #666;">No HTML content found</div>';

    // Inject CSS
    let cssContent = '';
    cssFiles.forEach(file => {
      cssContent += file.content + '\n';
    });

    // Basic JS content handling (for simple cases)
    let jsContent = '';
    jsFiles.forEach(file => {
      jsContent += file.content + '\n';
    });

    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        ${cssContent}
    </style>
</head>
<body>
    ${htmlContent}
    <script>
        // Basic error handling
        window.addEventListener('error', function(e) {
            console.error('Preview Error:', e.error);
        });
        
        ${jsContent}
    </script>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    iframeRef.current.src = url;

    // Cleanup previous URL
    return () => URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    updatePreview();
  };

  const toggleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleViewportChange = (size: ViewportSize) => {
    setViewportSize(size);
  };

  const openInNewTab = () => {
    if (iframeRef.current?.src) {
      window.open(iframeRef.current.src, '_blank');
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Live Preview</h3>
          {isLoading && (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Viewport size controls */}
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
            <button
              onClick={() => handleViewportChange('desktop')}
              className={`p-1.5 rounded-l ${
                viewportSize === 'desktop' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="Desktop view"
            >
              <AiOutlineDesktop size={16} />
            </button>
            <button
              onClick={() => handleViewportChange('tablet')}
              className={`p-1.5 ${
                viewportSize === 'tablet' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="Tablet view"
            >
              <AiOutlineTablet size={16} />
            </button>
            <button
              onClick={() => handleViewportChange('mobile')}
              className={`p-1.5 rounded-r ${
                viewportSize === 'mobile' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="Mobile view"
            >
              <AiOutlineMobile size={16} />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleRefresh}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Refresh preview"
            >
              <AiOutlineReload size={16} />
            </button>

            <button
              onClick={openInNewTab}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Open in new tab"
            >
              <FiExternalLink size={16} />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <AiOutlineFullscreenExit size={16} /> : <AiOutlineFullscreen size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
        {files.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="mb-4">
              <AiOutlineDesktop size={48} className="mx-auto opacity-50" />
            </div>
            <p className="text-lg mb-2">No preview available</p>
            <p className="text-sm">Generate code with AI to see live preview</p>
          </div>
        ) : (
          <div 
            className={`bg-white rounded-lg shadow-lg transition-all duration-300 ${
              viewportSize === 'desktop' ? 'w-full h-full' : ''
            }`}
            style={
              viewportSize !== 'desktop' 
                ? {
                    width: viewportSizes[viewportSize].width,
                    height: viewportSizes[viewportSize].height,
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }
                : { width: '100%', height: '100%' }
            }
          >
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0 rounded-lg"
              title="Live Preview"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              onLoad={() => {
                // Optional: Add load event handling
              }}
            />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span>Viewport: {viewportSize}</span>
            <span>Files: {files.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
