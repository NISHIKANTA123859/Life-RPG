import React from 'react';
import { RPGCanvas } from './RPGCanvas';
import './BackgroundEffects.css';

interface Props {
  currentPage: string;
}

export const RPGBackground: React.FC<Props> = ({ currentPage }) => {
  // Page-specific radial glow accent styles
  const getPageRadialStyle = () => {
    switch (currentPage) {
      case 'quests':
        return {
          background:
            'radial-gradient(circle at 75% 25%, rgba(139, 92, 246, 0.12) 0%, rgba(34, 211, 238, 0.05) 45%, transparent 70%)',
        };
      case 'character':
        return {
          background:
            'radial-gradient(circle at 50% 30%, rgba(236, 72, 153, 0.12) 0%, rgba(139, 92, 246, 0.06) 50%, transparent 75%)',
        };
      case 'skills':
        return {
          background:
            'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 70%)',
        };
      case 'ai-intel':
        return {
          background:
            'radial-gradient(circle at 30% 30%, rgba(6, 182, 212, 0.14) 0%, rgba(139, 92, 246, 0.06) 50%, transparent 70%)',
        };
      case 'achievements':
        return {
          background:
            'radial-gradient(circle at 50% 40%, rgba(245, 185, 44, 0.12) 0%, rgba(249, 115, 22, 0.05) 50%, transparent 75%)',
        };
      case 'shop':
        return {
          background:
            'radial-gradient(circle at 70% 30%, rgba(245, 185, 44, 0.14) 0%, rgba(234, 179, 8, 0.05) 50%, transparent 70%)',
        };
      case 'inventory':
        return {
          background:
            'radial-gradient(circle at 30% 60%, rgba(34, 211, 238, 0.12) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 70%)',
        };
      case 'activity':
        return {
          background:
            'radial-gradient(circle at 40% 50%, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.05) 50%, transparent 70%)',
        };
      case 'leaderboard':
        return {
          background:
            'radial-gradient(circle at 50% 25%, rgba(249, 115, 22, 0.12) 0%, rgba(245, 185, 44, 0.05) 50%, transparent 70%)',
        };
      case 'settings':
        return {
          background:
            'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 60%)',
        };
      default:
        return {
          background:
            'radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.12) 0%, rgba(34, 211, 238, 0.06) 40%, transparent 70%)',
        };
    }
  };

  return (
    <div className="rpg-bg-container" aria-hidden="true">
      {/* 9-Layer Animated Canvas */}
      <RPGCanvas currentPage={currentPage} />

      {/* Atmospheric smooth radial glow transition layer */}
      <div className="rpg-bg-radial-glow" style={getPageRadialStyle()} />
    </div>
  );
};
