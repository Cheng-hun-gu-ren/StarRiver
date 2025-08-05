import { useEffect, useRef } from 'react';
import { AITool } from '@/data/ai-tools';

interface ToolDetailPanelProps {
  tool: AITool | null;
  isVisible: boolean;
  onClose: () => void;
}

function getProficiencyDescription(proficiency: number): string {
  if (proficiency >= 90) return "专家级 - 深度集成工作流 | Expert Level";
  if (proficiency >= 80) return "熟练级 - 经常使用 | Proficient";
  if (proficiency >= 70) return "中级 - 定期使用 | Intermediate";
  return "初级 - 偶尔使用 | Beginner";
}

export function ToolDetailPanel({ tool, isVisible, onClose }: ToolDetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      panelRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, onClose]);

  if (!tool) return null;

  return (
    <div 
      ref={panelRef}
      className={`tool-detail-panel ${isVisible ? 'visible' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tool-title"
      tabIndex={-1}
    >
      <button 
        className="close-panel-btn" 
        onClick={onClose}
        aria-label="Close panel"
      >
        ×
      </button>
      
      <div className="detail-header">
        <div className="detail-icon">{tool.icon}</div>
        <div className="detail-info">
          <h3 id="tool-title">{tool.name}</h3>
          <span className="detail-category">{tool.category}</span>
        </div>
      </div>
      
      <p className="detail-description">{tool.description}</p>
      
      <div className="detail-stats">
        <div className="proficiency-ring">
          <span>{tool.proficiency}%</span>
        </div>
        <div className="proficiency-info">
          <div className="proficiency-label">熟练度 | Proficiency</div>
          <div className="proficiency-description">
            {getProficiencyDescription(tool.proficiency)}
          </div>
        </div>
      </div>
      
      <div className="detail-section">
        <h4 style={{ marginBottom: '0.5rem', color: '#ffffff' }}>
          使用场景 | Use Cases
        </h4>
        <p style={{ color: '#d1d5db', fontSize: '0.9rem' }}>
          {tool.usage}
        </p>
      </div>
      
      <div className="detail-features">
        {tool.features.map((feature, index) => (
          <span key={index} className="feature-tag">
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
}
