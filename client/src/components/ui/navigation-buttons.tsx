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
  return (
    <nav className="navigation-container" role="navigation" aria-label="Constellation Navigation">
      <div className="nav-buttons">
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
      </div>
    </nav>
  );
}
