import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  isVisible: boolean;
  progress: number;
  text: string;
}

export function LoadingScreen({ isVisible, progress, text }: LoadingScreenProps) {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div className={`loading-screen ${!isVisible ? 'hidden' : ''}`}>
      <div className="loading-spinner"></div>
      <div className="loading-text">{text}</div>
      <div className="loading-progress">
        <div 
          className="loading-progress-bar" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
