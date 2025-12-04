import React from 'react';
import { X } from 'lucide-react';
import { Skill } from '../types';

interface SkillBadgeProps {
  skill: Skill;
  type: 'offered' | 'wanted';
  onRemove?: () => void;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, type, onRemove }) => {
  const isOffered = type === 'offered';
  const bgClass = isOffered ? 'bg-green-100 text-green-800 border-green-200' : 'bg-blue-100 text-blue-800 border-blue-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${bgClass}`}>
      {skill.name}
      <span className="mx-1 opacity-50">•</span>
      <span className="opacity-75">{skill.level}</span>
      {onRemove && (
        <button onClick={onRemove} className="ml-1.5 hover:opacity-50 focus:outline-none">
          <X size={12} />
        </button>
      )}
    </span>
  );
};
