import React, { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DropdownProps {
  children: ReactNode;
  label: string;
  colorScheme?: 'default';
  className?: string;
}

export function Dropdown({ 
  children, 
  label, 
  colorScheme = 'default',
  className 
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const colorStyles = {
    default: 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700',
  };

  return (
    <div className={cn('relative', className)}>
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full px-3 py-2 text-left text-sm font-medium rounded-md transition-colors flex items-center justify-between',
          colorStyles[colorScheme]
        )}
        whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
        whileTap={{ scale: 0.98 }}
      >
        {label}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn('rounded-lg border shadow-sm', colorStyles[colorScheme], className)}
          >
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}