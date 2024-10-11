import React from 'react';

interface BoardBadgeProps {
  label: string;
  type: 'other';
}

const BoardBadge: React.FC<BoardBadgeProps> = ({ label }) => {
  return (
    <span className="flex items-center rounded-md border-2 border-gray-200 bg-white px-2 py-1 text-sm text-black">
      {label}
    </span>
  );
};

export default BoardBadge;
