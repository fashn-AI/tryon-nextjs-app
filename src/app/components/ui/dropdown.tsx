import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DropdownProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  initialOpen?: boolean;
  colorScheme?: 'blue' | 'green' | 'purple' | 'default';
}

export function Dropdown({ 
  label, 
  children, 
  className, 
  initialOpen = false,
  colorScheme = 'default'
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const colorStyles = {
    default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    blue: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40',
    green: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/40',
    purple: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/40',
  };

  return (
    <div className={cn('rounded-lg border shadow-sm', colorStyles[colorScheme], className)}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full p-3 flex justify-between items-center font-medium text-left focus:outline-none"
      >
        {label}
        <span className="ml-2">
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </span>
      </button>
      
      {isOpen && (
        <div className="overflow-hidden border-t border-gray-200 dark:border-gray-700">
          <div className="p-3 pt-0">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}