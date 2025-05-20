import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

type SliderProps = {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  colorScheme?: 'blue' | 'green' | 'purple';
  className?: string;
  label?: string;
  showValue?: boolean;
};

export default function Slider({
  min,
  max,
  step = 1,
  value,
  onChange,
  colorScheme = 'purple',
  className,
  label,
  showValue = true,
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const colorStyles = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
  };

  const thumbShadow = {
    blue: 'shadow-[0_0_0_6px_rgba(37,99,235,0.1)]',
    green: 'shadow-[0_0_0_6px_rgba(22,163,74,0.1)]',
    purple: 'shadow-[0_0_0_6px_rgba(147,51,234,0.1)]',
  };

  const calculatePercentage = () => {
    return ((value - min) / (max - min)) * 100;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newValue = Math.round((percentage * (max - min) + min) / step) * step;
    
    onChange(newValue);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        {showValue && (
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {value}
          </span>
        )}
      </div>
      <div className="relative py-2" onClick={handleTrackClick} ref={trackRef}>
        <div
          className="absolute inset-y-0 left-0 my-auto h-1.5 rounded-full bg-gray-200 dark:bg-gray-700"
          style={{ width: '100%' }}
        ></div>
        <div
          className={cn('absolute inset-y-0 left-0 my-auto h-1.5 rounded-full', colorStyles[colorScheme])}
          style={{ width: `${calculatePercentage()}%` }}
        ></div>
        <motion.div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white border border-gray-200 dark:border-gray-600 cursor-grab',
            isDragging && 'cursor-grabbing',
            isDragging && thumbShadow[colorScheme]
          )}
          style={{ left: `calc(${calculatePercentage()}% - 10px)` }}
          whileTap={{ scale: 1.2 }}
          whileHover={{ scale: 1.1 }}
          onTapStart={() => setIsDragging(true)}
          onTapEnd={() => setIsDragging(false)}
        ></motion.div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}