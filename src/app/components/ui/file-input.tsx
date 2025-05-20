import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { cn } from '../../lib/utils';

type FileInputProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  colorScheme?: 'blue' | 'green' | 'purple';
  className?: string;
  label?: string;
};

export default function FileInput({
  onChange,
  accept = 'image/*',
  colorScheme = 'blue',
  className,
  label = 'Upload file',
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const colorStyles = {
    blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200 dark:bg-blue-950/20 dark:hover:bg-blue-950/30 dark:border-blue-900/50 file:bg-blue-100 file:text-blue-700 dark:file:bg-blue-800 dark:file:text-blue-100',
    green: 'bg-green-50 hover:bg-green-100 border-green-200 dark:bg-green-950/20 dark:hover:bg-green-950/30 dark:border-green-900/50 file:bg-green-100 file:text-green-700 dark:file:bg-green-800 dark:file:text-green-100',
    purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200 dark:bg-purple-950/20 dark:hover:bg-purple-950/30 dark:border-purple-900/50 file:bg-purple-100 file:text-purple-700 dark:file:bg-purple-800 dark:file:text-purple-100',
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Create a synthetic event to pass to the onChange handler
      const syntheticEvent = {
        target: {
          files: e.dataTransfer.files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      onChange(syntheticEvent);
    }
  };

  return (
    <motion.div 
      className={cn(
        "cursor-pointer relative flex items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
        colorStyles[colorScheme],
        isDragging && "border-solid",
        className
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={inputRef}
        accept={accept}
        onChange={onChange}
        className="sr-only"
      />
      <div className="flex flex-col items-center gap-2 text-center">
        <Upload className="h-10 w-10 text-gray-400" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs text-gray-500">
            Drag and drop here or click to browse
          </span>
        </div>
      </div>
    </motion.div>
  );
}