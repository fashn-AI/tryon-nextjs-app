import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge className values with Tailwind classes
 * Combines clsx and tailwind-merge for clean class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Constants for animation variants
 */
export const FADE_IN_ANIMATION_VARIANTS = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
};

export const FADE_IN_ANIMATION_CARD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.2
    } 
  },
};

export const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.2
    } 
  },
};

export const STAGGER_ANIMATION_VARIANTS = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      duration: 0.2
    }
  }
};