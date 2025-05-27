'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, ExternalLink, Github } from 'lucide-react';
import Button from './ui/button';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

export default function ApiKeyModal({ isOpen, onClose, onSave }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('Please enter your API key');
      return;
    }
    
    // Basic validation - FASHN API keys typically start with 'fa-'
    if (!apiKey.trim().startsWith('fa-')) {
      setError('FASHN API keys typically start with "fa-"');
      return;
    }

    onSave(apiKey.trim());
    setApiKey('');
    setError('');
  };

  const handleCancel = () => {
    setApiKey('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Enter FASHN API Key
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                To use the virtual try-on feature, you need a FASHN API key. Your key will be stored locally in your browser.
              </p>

              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setError('');
                  }}
                  placeholder="fa-xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  autoFocus
                />
                {error && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Don&apos;t have an API key yet?
                </p>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://docs.fashn.ai/?utm_source=nextjs-tryon-app&utm_medium=modal&utm_campaign=api-key"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                >
                  Get your API key from FASHN
                  <ExternalLink className="h-3 w-3" />
                </motion.a>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-md p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Want to run this yourself?
                </p>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://github.com/fashn-AI/tryon-nextjs-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                >
                  View source code on GitHub
                  <Github className="h-3 w-3" />
                </motion.a>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1"
                >
                  Save API Key
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 