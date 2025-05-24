import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  colorScheme?: 'default';
  className?: string;
}

export default function Slider({
  min,
  max,
  step,
  value,
  onChange,
  label,
  colorScheme = 'default',
  className,
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const colorStyles = {
    default: 'bg-gray-900 dark:bg-gray-100',
  };

  const thumbShadow = {
    default: 'shadow-lg shadow-gray-900/25 dark:shadow-gray-100/25',
  };

  const calculateValue = useCallback((clientX: number) => {
    if (!sliderRef.current) return value;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = min + percentage * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    
    return Math.max(min, Math.min(max, steppedValue));
  }, [min, max, step, value]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    const newValue = calculateValue(e.clientX);
    onChange(newValue);
  }, [calculateValue, onChange]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const newValue = calculateValue(e.clientX);
    onChange(newValue);
  }, [isDragging, calculateValue, onChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div className="flex justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {value}
          </span>
        </div>
      )}
      <div
        ref={sliderRef}
        className="relative h-6 cursor-pointer flex items-center"
        onMouseDown={handleMouseDown}
      >
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div
            className={cn('absolute inset-y-0 left-0 my-auto h-1.5 rounded-full', colorStyles[colorScheme])}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <motion.div
          className={cn(
            'absolute w-4 h-4 bg-white border-2 border-gray-900 dark:border-gray-100 rounded-full cursor-grab',
            isDragging && 'cursor-grabbing scale-110',
            isDragging && thumbShadow[colorScheme]
          )}
          style={{ left: `calc(${percentage}% - 8px)` }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 1.2 }}
        />
      </div>
    </div>
  );
}