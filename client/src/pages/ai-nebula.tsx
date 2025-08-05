import { useState, useEffect } from 'react';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { ToolDetailPanel } from '@/components/ui/tool-detail-panel';
import { NavigationButtons } from '@/components/ui/navigation-buttons';
import { useThreeScene } from '@/hooks/use-three-scene';
import { AITool } from '@/data/ai-tools';

export default function AINebulaPage() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('正在初始化星云...');
  const [isLoadingVisible, setIsLoadingVisible] = useState(true);
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [isToolPanelVisible, setIsToolPanelVisible] = useState(false);
  const [activeView, setActiveView] = useState('global');
  const [instructionVisible, setInstructionVisible] = useState(true);

  const { containerRef, isInitialized } = useThreeScene({
    onToolClick: (tool) => {
      setSelectedTool(tool);
      setIsToolPanelVisible(true);
    },
    onLoadingProgress: (progress, text) => {
      setLoadingProgress(progress);
      setLoadingText(text);
      
      if (progress >= 100) {
        setTimeout(() => {
          setIsLoadingVisible(false);
        }, 500);
      }
    },
    activeView
  });

  useEffect(() => {
    // Hide instructions after 5 seconds
    const timer = setTimeout(() => {
      setInstructionVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Handle keyboard shortcuts
    const handleKeyDown = (event: KeyboardEvent) => {
      switch(event.code) {
        case 'Escape':
          setIsToolPanelVisible(false);
          break;
        case 'KeyG':
          setActiveView('global');
          break;
        case 'Digit1':
          setActiveView('开发星座');
          break;
        case 'Digit2':
          setActiveView('内容星座');
          break;
        case 'Digit3':
          setActiveView('效率星座');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCloseToolPanel = () => {
    setIsToolPanelVisible(false);
    setSelectedTool(null);
  };

  const handleGlobalView = () => {
    setActiveView('global');
  };

  const handleConstellationView = (constellation: string) => {
    setActiveView(constellation);
  };

  return (
    <div className="relative w-full h-full">
      <LoadingScreen 
        isVisible={isLoadingVisible}
        progress={loadingProgress}
        text={loadingText}
      />

      {/* 3D Canvas Container */}
      <div 
        ref={containerRef}
        className="ai-nebula-container"
        role="application"
        aria-label="晨昏故人的3D AI工具星座可视化"
      />

      {/* UI Overlay */}
      <div className="ui-overlay">
        <header className="header-section">
          <h1 className="main-title">晨昏故人的AI工具星云</h1>
          <p className="subtitle">
            晨昏故人的AI工具交互知识图谱 | Interactive AI Tools Knowledge Graph
          </p>
        </header>

        <NavigationButtons 
          activeView={activeView}
          onGlobalView={handleGlobalView}
          onConstellationView={handleConstellationView}
        />

        <div 
          className={`instruction-text ${!instructionVisible ? 'fade-out' : ''}`}
          role="status" 
          aria-live="polite"
        >
          拖拽可旋转，点击星辰可探索 | Drag to rotate, click stars to explore
        </div>
      </div>

      {/* Tool Detail Panel */}
      <ToolDetailPanel 
        tool={selectedTool}
        isVisible={isToolPanelVisible}
        onClose={handleCloseToolPanel}
      />

      {/* Performance Monitor (hidden by default) */}
      <div className="fps-monitor" id="fps-monitor">
        FPS: --
      </div>
    </div>
  );
}
