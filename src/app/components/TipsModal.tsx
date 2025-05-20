import React from 'react';
import { Lightbulb, Camera, RectangleHorizontal, Users, Image as ImageIcon, Info } from 'lucide-react';
import { Modal } from './ui/modal';
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
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
  },
  {
    id: 2,
    title: 'One person per image',
    description: 'Ensure each photo contains only one person to avoid confusion in the virtual try-on process.',
    icon: <Users className="h-5 w-5" />,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
  },
  {
    id: 3,
    title: 'Focus/Zoom on subject',
    description: 'Frame your shots to properly focus on the person or garment, avoiding too much background or distractions.',
    icon: <Camera className="h-5 w-5" />,
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
  },
  {
    id: 4,
    title: 'Similar poses between images',
    description: 'For best results, try to match the pose of the model with the pose of the garment model (if applicable).',
    icon: <ImageIcon className="h-5 w-5" />,
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
  },
  {
    id: 5,
    title: 'High-quality images',
    description: 'Use clear, well-lit images with good resolution to get the most accurate and realistic virtual try-on results.',
    icon: <Info className="h-5 w-5" />,
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
  }
];

interface TipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TipsModal({ isOpen, onClose }: TipsModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      className="max-w-3xl"
    >
      <div className="flex items-center gap-2 justify-center mb-6">
        <Lightbulb className="h-6 w-6 text-yellow-500" />
        <h2 className="text-xl font-semibold text-center">Tips for successful try-on generations</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className={cn(
              "rounded-lg p-4 shadow-sm relative overflow-hidden",
              tip.color
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              {tip.icon}
              <h3 className="font-medium">{tip.title}</h3>
            </div>
            
            <p className="text-sm opacity-90 z-10 relative">
              {tip.description}
            </p>
            
            {/* Background decoration */}
            <div className="absolute right-0 bottom-0 opacity-10">
              {tip.icon && React.cloneElement(tip.icon as React.ReactElement, { 
                className: "h-24 w-24" 
              })}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}