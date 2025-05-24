import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Camera, RectangleHorizontal, Users, Image as ImageIcon, Info } from 'lucide-react';
import { cn } from '../lib/utils';

type Tip = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
};

const tips: Tip[] = [
  {
    id: 1,
    title: '2:3 aspect ratio',
    description: 'Use images with a portrait orientation (2:3 aspect ratio) for best results in the virtual try-on process.',
    icon: <RectangleHorizontal className="h-5 w-5" />,
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  },
  {
    id: 2,
    title: 'One person per image',
    description: 'Ensure each photo contains only one person to avoid confusion in the virtual try-on process.',
    icon: <Users className="h-5 w-5" />,
    color: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  },
  {
    id: 3,
    title: 'Focus/Zoom on subject',
    description: 'Frame your shots to properly focus on the person or garment, avoiding too much background or distractions.',
    icon: <Camera className="h-5 w-5" />,
    color: 'bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400'
  },
  {
    id: 4,
    title: 'Similar poses between images',
    description: 'For best results, try to match the pose of the model with the pose of the garment model (if applicable).',
    icon: <ImageIcon className="h-5 w-5" />,
    color: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  },
  {
    id: 5,
    title: 'High-quality images',
    description: 'Use clear, well-lit images with good resolution to get the most accurate and realistic virtual try-on results.',
    icon: <Info className="h-5 w-5" />,
    color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
  }
];

export default function Tips() {
  const [expandedTip, setExpandedTip] = useState<number | null>(null);
  
  const toggleTip = (id: number) => {
    setExpandedTip(expandedTip === id ? null : id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col gap-4 my-4 bg-gray-50 dark:bg-gray-800 shadow-sm"
    >
      <div className="flex items-center gap-2 justify-center">
        <Lightbulb className="h-5 w-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-center">Tips for successful try-on generations</h2>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {tips.map((tip) => (
          <motion.div
            key={tip.id}
            className={cn(
              "rounded-lg p-3 cursor-pointer transition-all hover:shadow-md relative overflow-hidden flex flex-col",
              expandedTip === tip.id ? 'row-span-2 col-span-1 md:col-span-2' : '',
              tip.color
            )}
            onClick={() => toggleTip(tip.id)}
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              show: { opacity: 1, scale: 1 }
            }}
            whileHover={{ scale: expandedTip === tip.id ? 1 : 1.03 }}
            whileTap={{ scale: 0.98 }}
            layout
          >
            <div className="flex items-center gap-2 z-10">
              {tip.icon}
              <h3 className="font-medium">{tip.title}</h3>
            </div>
            
            <AnimatePresence>
              {expandedTip === tip.id && (
                <motion.p 
                  className="mt-2 text-sm opacity-90 z-10"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {tip.description}
                </motion.p>
              )}
            </AnimatePresence>
            
            {/* Background decoration */}
            <motion.div 
              className="absolute right-0 bottom-0 opacity-10"
              animate={{ 
                rotate: expandedTip === tip.id ? [0, 5, 0] : 0,
                scale: expandedTip === tip.id ? [1, 1.05, 1] : 1
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {tip.icon && React.cloneElement(tip.icon as React.ReactElement<{ className?: string }>, { 
                className: "h-16 w-16" 
              })}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.p 
        className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2 italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Click on any tip for more information
      </motion.p>
    </motion.div>
  );
}