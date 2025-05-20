import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  colorScheme?: 'blue' | 'green' | 'purple';
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, colorScheme = 'blue', ...props }, ref) => {
    const id = React.useId();
    
    const colorStyles = {
      blue: 'border-blue-300 dark:border-blue-700 data-[checked]:bg-blue-600 data-[checked]:border-blue-600 dark:data-[checked]:bg-blue-600 dark:data-[checked]:border-blue-600 focus-visible:ring-blue-500',
      green: 'border-green-300 dark:border-green-700 data-[checked]:bg-green-600 data-[checked]:border-green-600 dark:data-[checked]:bg-green-600 dark:data-[checked]:border-green-600 focus-visible:ring-green-500',
      purple: 'border-purple-300 dark:border-purple-700 data-[checked]:bg-purple-600 data-[checked]:border-purple-600 dark:data-[checked]:bg-purple-600 dark:data-[checked]:border-purple-600 focus-visible:ring-purple-500',
    };

    return (
      <div className="flex items-start gap-2">
        <div className="relative flex items-center">
          <motion.input
            type="checkbox"
            id={props.id || id}
            ref={ref}
            className="peer sr-only"
            {...props}
          />
          <motion.div
            className={cn(
              "h-4 w-4 shrink-0 rounded border border-gray-300 dark:border-gray-700 ring-offset-white transition-all peer-disabled:cursor-not-allowed peer-disabled:opacity-50 dark:ring-offset-gray-950",
              colorStyles[colorScheme],
              "peer-checked:data-[checked]:border-transparent peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2",
              className
            )}
            data-checked={props.checked ? '' : undefined}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 1 }}
            animate={{ scale: 1 }}
          >
            {props.checked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.1 }}
                className="flex h-full w-full items-center justify-center"
              >
                <Check className="h-3 w-3 text-white" />
              </motion.div>
            )}
          </motion.div>
        </div>
        {(label || description) && (
          <div className="grid gap-0.5 leading-none">
            {label && (
              <label
                htmlFor={props.id || id}
                className="cursor-pointer text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;