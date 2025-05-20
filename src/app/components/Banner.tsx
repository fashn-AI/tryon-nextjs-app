import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Github, Linkedin, Instagram, MessageSquare, ExternalLink } from 'lucide-react';
import { FADE_IN_ANIMATION_VARIANTS, STAGGER_ANIMATION_VARIANTS, cn } from '../lib/utils';

const socialLinks = [
  { 
    name: 'FASHN AI', 
    href: 'https://fashn.ai', 
    icon: <ExternalLink className="h-4 w-4" />,
    color: 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600'
  },
  { 
    name: 'GitHub', 
    href: 'https://github.com/fashn-AI', 
    icon: <Github className="h-4 w-4" />,
    color: 'bg-[#24292F] hover:bg-[#24292F]/90 dark:bg-[#24292F]/80 dark:hover:bg-[#24292F]'
  },
  { 
    name: 'LinkedIn', 
    href: 'https://www.linkedin.com/company/fashn', 
    icon: <Linkedin className="h-4 w-4" />,
    color: 'bg-[#0077B5] hover:bg-[#0077B5]/90 dark:bg-[#0077B5]/80 dark:hover:bg-[#0077B5]'
  },
  { 
    name: 'Twitter', 
    href: 'https://x.com/fashn_ai', 
    icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>,
    color: 'bg-black hover:bg-black/90 dark:bg-black/80 dark:hover:bg-black'
  },
  { 
    name: 'Instagram', 
    href: 'https://www.instagram.com/fashn.ai/', 
    icon: <Instagram className="h-4 w-4" />,
    color: 'bg-[#E4405F] hover:bg-[#E4405F]/90 dark:bg-[#E4405F]/80 dark:hover:bg-[#E4405F]'
  },
  { 
    name: 'Discord', 
    href: 'https://discord.gg/MCs39Gf4yn', 
    icon: <MessageSquare className="h-4 w-4" />,
    color: 'bg-[#5865F2] hover:bg-[#5865F2]/90 dark:bg-[#5865F2]/80 dark:hover:bg-[#5865F2]'
  },
];

export default function Banner() {
  return (
    <motion.div 
      className="rounded-lg overflow-hidden"
      initial="hidden"
      animate="show"
      variants={FADE_IN_ANIMATION_VARIANTS}
    >
      <div className="relative flex flex-col justify-center items-center text-center p-8 gap-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/5"
              style={{
                width: Math.random() * 40 + 10,
                height: Math.random() * 40 + 10,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * -100 - 50],
                opacity: [0, 0.4, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
        
        {/* Logo with animation */}
        <motion.div 
          className="flex gap-4 items-center relative z-10"
          variants={FADE_IN_ANIMATION_VARIANTS}
        >
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Image
              src="https://cilsrdpvqtgutxprdofn.supabase.co/storage/v1/object/public/assets/logo-enhanced_60x60.png"
              alt="FASHN AI Logo"
              width={70}
              height={70}
              className="rounded-lg shadow-lg"
              unoptimized
            />
          </motion.div>
          <div className="text-left">
            <motion.h1 
              className="text-4xl text-white m-0 font-sans font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              FASHN AI
            </motion.h1>
            <motion.span 
              className="text-lg text-purple-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Example App
            </motion.span>
          </div>
        </motion.div>
        
        {/* Description text */}
        <motion.p 
          className="max-w-2xl m-0 leading-relaxed text-base text-white/80 relative z-10"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.3 }}
        >
          Welcome to this Next.js app example for the FASHN Virtual Try-On API!
          This UI is designed as a starting point to help you explore and better understand 
          how to interact with the API and its different parameters.
        </motion.p>
        
        {/* Social links */}
        <motion.div 
          className="flex justify-center items-center text-center gap-2 flex-wrap relative z-10"
          variants={STAGGER_ANIMATION_VARIANTS}
          initial="hidden"
          animate="show"
        >
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
                link.color
              )}
              variants={FADE_IN_ANIMATION_VARIANTS}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 0.1 * index }}
            >
              {link.icon}
              {link.name}
            </motion.a>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}