import { useState } from 'react';
import { constellations } from '@/data/ai-tools';

interface NavigationButtonsProps {
  activeView: string;
  onGlobalView: () => void;
  onConstellationView: (constellation: string) => void;
}

function getConstellationIcon(name: string): string {
  const icons: Record<string, string> = {
    '开发星座': '💻',
    '内容星座': '📝',
    '效率星座': '⚡'
  };
  return icons[name] || '⭐';
}

export function NavigationButtons({ 
  activeView, 
  onGlobalView, 
  onConstellationView 
}: NavigationButtonsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <nav className="navigation-container" role="navigation" aria-label="Constellation Navigation">
      <div className="nav-buttons">
        {!isExpanded ? (
          // 收起状态：只显示展开按钮
          <button 
            className="nav-button expand-button"
            onClick={toggleExpanded}
            aria-label="展开视图选项"
          >
            📊 展开视图
          </button>
        ) : (
          // 展开状态：显示所有按钮
          <>
            <button 
              className={`nav-button ${activeView === 'global' ? 'active' : ''}`}
              onClick={onGlobalView}
              aria-label="View all constellations"
            >
              🌌 全局视图 | Global
            </button>
            
            {constellations.map((constellation) => (
              <button 
                key={constellation.name}
                className={`nav-button ${activeView === constellation.name ? 'active' : ''}`}
                onClick={() => onConstellationView(constellation.name)}
                aria-label={`Focus on ${constellation.name} constellation`}
              >
                {getConstellationIcon(constellation.name)} {constellation.name}
              </button>
            ))}
            
            <button 
              className="nav-button collapse-button"
              onClick={toggleExpanded}
              aria-label="收起视图选项"
            >
              &lt;&lt;
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
