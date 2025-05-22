import React from 'react';

interface ProgressBarProps {
  percentage: number;
}

const ProgressBar = ({ percentage }: ProgressBarProps) => {
  return (
    <div className="w-full bg-[#EEEEEE] rounded-full h-2">
      <div
        className="bg-[#5CE1E6] h-2 rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
