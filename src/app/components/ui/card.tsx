import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { FADE_IN_ANIMATION_CARD_VARIANTS } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  colorScheme?: 'blue' | 'green' | 'purple' | 'default';
}

export function Card({ children, className, colorScheme = 'default' }: CardProps) {
  const colorStyles = {
    default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    blue: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50',
    green: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50',
    purple: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/50',
  };

  return (
    <motion.div
      variants={FADE_IN_ANIMATION_CARD_VARIANTS}
      initial="hidden"
      animate="show"
      className={cn(
        'rounded-lg border shadow-sm transition-all',
        colorStyles[colorScheme],
        className
      )}
    >
      {children}
    </motion.div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn('text-sm text-gray-500 dark:text-gray-400', className)}>
      {children}
    </p>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('p-6 pt-0', className)}>{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('flex items-center p-6 pt-0', className)}>
      {children}
    </div>
  );
}