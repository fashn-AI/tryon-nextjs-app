import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { cn } from '../../lib/utils';

type FileInputProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  colorScheme?: 'default';
  className?: string;
  label?: string;
};

export default function FileInput({
  onChange,
  accept = 'image/*',
  colorScheme = 'default',
  className,
  label = 'Upload file',
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const colorStyles = {
    default: 'bg-gray-50 hover:bg-gray-100 border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 file:bg-gray-100 file:text-gray-700 dark:file:bg-gray-700 dark:file:text-gray-100',
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
        "cursor-pointer relative flex items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors",
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
      <div className="flex flex-col items-center gap-1 text-center">
        <Upload className="h-6 w-6 text-gray-400" />
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-xs font-medium">{label}</span>
          <span className="text-xs text-gray-500">
            Drag and drop here or click to browse
          </span>
        </div>
      </div>
    </motion.div>
  );
}