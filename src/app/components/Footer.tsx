import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Heart, Github } from 'lucide-react';
import { FADE_IN_ANIMATION_VARIANTS, STAGGER_ANIMATION_VARIANTS, cn } from '../lib/utils';

type Resource = {
  title: string;
  href: string;
  description: string;
  icon: React.ReactNode;
  color: string;
};

const resources: Resource[] = [
  {
    title: 'GitHub Repository',
    href: 'https://github.com/fashn-AI/tryon-nextjs-app',
    description: 'Source code for this Next.js virtual try-on application',
    icon: <Github className="h-5 w-5" />,
    color: 'from-gray-500 to-gray-600'
  },
  {
    title: 'API Parameters Guide',
    href: 'https://docs.fashn.ai/guides/api-parameters-guide?utm_source=nextjs-tryon-app&utm_medium=footer&utm_campaign=documentation',
    description: 'Learn about all available parameters for the FASHN API',
    icon: <BookOpen className="h-5 w-5" />,
    color: 'from-gray-600 to-gray-700'
  },
  {
    title: 'FASHN API Documentation',
    href: 'https://docs.fashn.ai/?utm_source=nextjs-tryon-app&utm_medium=footer&utm_campaign=documentation',
    description: 'Full documentation for the FASHN API',
    icon: <ExternalLink className="h-5 w-5" />,
    color: 'from-gray-700 to-gray-800'
  }
];

type BackgroundElement = {
  width: number;
  height: number;
  top: string;
  left: string;
  yAnimation: number;
  duration: number;
  delay: number;
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [backgroundElements, setBackgroundElements] = useState<BackgroundElement[]>([]);

  useEffect(() => {
    // Generate random values only on client side to prevent hydration mismatch
    const elements = [...Array(10)].map(() => ({
      width: Math.random() * 30 + 10,
      height: Math.random() * 30 + 10,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      yAnimation: Math.random() * -50 - 30,
      duration: Math.random() * 8 + 10,
      delay: Math.random() * 5,
    }));
    setBackgroundElements(elements);
  }, []);

  return (
    <motion.footer 
      className="mt-16 rounded-lg overflow-hidden"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={FADE_IN_ANIMATION_VARIANTS}
    >
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {backgroundElements.map((element, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/5"
              style={{
                width: element.width,
                height: element.height,
                top: element.top,
                left: element.left,
              }}
              animate={{
                y: [0, element.yAnimation],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: element.duration,
                repeat: Infinity,
                ease: "linear",
                delay: element.delay,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <motion.div 
            className="flex justify-center items-center mb-4 sm:mb-6"
            variants={FADE_IN_ANIMATION_VARIANTS}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white">Additional Resources</h2>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 max-w-6xl mx-auto"
            variants={STAGGER_ANIMATION_VARIANTS}
          >
            {resources.map((resource) => (
              <motion.a
                key={resource.title}
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col p-3 sm:p-6 bg-gray-800/50 hover:bg-gray-800 rounded-lg backdrop-blur-sm border border-gray-700/50 transition-all duration-300"
                variants={FADE_IN_ANIMATION_VARIANTS}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700 text-white",
                    resource.color
                  )}>
                    {resource.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-gray-300 transition-colors">
                    {resource.title}
                  </h3>
                </div>
                <p className="text-gray-300/80 text-xs sm:text-sm mb-2">
                  {resource.description}
                </p>
                <div className="mt-auto flex items-center text-gray-400 text-sm gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <ExternalLink className="h-3 w-3" />
                </div>
                
                {/* Gradient border animation */}
                <motion.div 
                  className="absolute inset-0 rounded-lg z-[-1] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ 
                    background: `linear-gradient(90deg, #4B5563 0%, transparent 25%, transparent 75%, #4B5563 100%)`,
                    backgroundSize: '200% 100%',
                    padding: '1px',
                  }}
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 0%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'linear',
                  }}
                />
              </motion.a>
            ))}
          </motion.div>
          
          <motion.div
            className="mt-10 text-center text-gray-400 text-sm"
            variants={FADE_IN_ANIMATION_VARIANTS}
          >
            <p className="flex items-center justify-center gap-1">
              Made with <Heart className="h-4 w-4 text-gray-400 animate-pulse" /> by FASHN AI | © {currentYear}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
}