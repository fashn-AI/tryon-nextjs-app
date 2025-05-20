import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

type Option = {
  label: string;
  value: string;
  description?: string;
};

type RadioGroupProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  colorScheme?: 'blue' | 'green' | 'purple';
  layout?: 'horizontal' | 'vertical';
  variant?: 'default' | 'card';
  size?: 'sm' | 'md';
  className?: string;
  label?: string;
};

export default function RadioGroup({
  options,
  value,
  onChange,
  name,
  colorScheme = 'purple',
  layout = 'horizontal',
  variant = 'default',
  size = 'md',
  className,
  label
}: RadioGroupProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClick = (optionValue: string) => {
    if (optionValue !== value) {
      onChange(optionValue);
    }
  };

  const colorStyles = {
    blue: {
      radio: 'border-blue-300 dark:border-blue-700 data-[checked]:border-blue-600 data-[checked]:bg-blue-600 dark:data-[checked]:border-blue-600 dark:data-[checked]:bg-blue-600 focus-visible:ring-blue-500',
      card: 'border-blue-200 dark:border-blue-900 data-[checked]:border-blue-600 data-[checked]:bg-blue-50 dark:data-[checked]:border-blue-600 dark:data-[checked]:bg-blue-900/20',
      dot: 'bg-white dark:bg-white'
    },
    green: {
      radio: 'border-green-300 dark:border-green-700 data-[checked]:border-green-600 data-[checked]:bg-green-600 dark:data-[checked]:border-green-600 dark:data-[checked]:bg-green-600 focus-visible:ring-green-500',
      card: 'border-green-200 dark:border-green-900 data-[checked]:border-green-600 data-[checked]:bg-green-50 dark:data-[checked]:border-green-600 dark:data-[checked]:bg-green-900/20',
      dot: 'bg-white dark:bg-white'
    },
    purple: {
      radio: 'border-purple-300 dark:border-purple-700 data-[checked]:border-purple-600 data-[checked]:bg-purple-600 dark:data-[checked]:border-purple-600 dark:data-[checked]:bg-purple-600 focus-visible:ring-purple-500',
      card: 'border-purple-200 dark:border-purple-900 data-[checked]:border-purple-600 data-[checked]:bg-purple-50 dark:data-[checked]:border-purple-600 dark:data-[checked]:bg-purple-900/20', 
      dot: 'bg-white dark:bg-white'
    },
  };

  const sizeStyles = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div 
        className={cn(
          'gap-3',
          layout === 'horizontal' ? 'flex flex-wrap' : 'flex flex-col',
          variant === 'card' && 'grid grid-cols-1 sm:grid-cols-auto-fill'
        )}
      >
        {options.map((option) => (
          variant === 'default' ? (
            <motion.label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="relative flex h-5 w-5 items-center justify-center">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <motion.div
                  className={cn(
                    "h-4 w-4 rounded-full border transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2",
                    colorStyles[colorScheme].radio
                  )}
                  data-checked={value === option.value ? '' : undefined}
                >
                  {value === option.value && (
                    <motion.div
                      className={cn(
                        "h-1.5 w-1.5 rounded-full absolute inset-0 m-auto",
                        colorStyles[colorScheme].dot
                      )}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.1 }}
                    />
                  )}
                </motion.div>
              </div>
              <span className="text-sm">{option.label}</span>
            </motion.label>
          ) : (
            <motion.div
              key={option.value}
              className={cn(
                "relative border rounded-lg p-4 cursor-pointer transition-all",
                colorStyles[colorScheme].card,
                value === option.value && "shadow-sm"
              )}
              data-checked={value === option.value ? '' : undefined}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleClick(option.value)}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="flex items-start gap-3">
                <div className="relative flex h-5 w-5 items-center justify-center mt-0.5">
                  <motion.div
                    className={cn(
                      "h-4 w-4 rounded-full border transition-all",
                      colorStyles[colorScheme].radio
                    )}
                    data-checked={value === option.value ? '' : undefined}
                  >
                    {value === option.value && (
                      <motion.div
                        className={cn(
                          "h-1.5 w-1.5 rounded-full absolute inset-0 m-auto",
                          colorStyles[colorScheme].dot
                        )}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.1 }}
                      />
                    )}
                  </motion.div>
                </div>
                <div className="grid gap-1">
                  <div className="text-sm font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        ))}
      </div>
    </div>
  );
}