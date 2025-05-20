'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import { Upload, Check, X, RefreshCw, Sparkles, Settings, Zap, UserRound, Shirt, Lightbulb } from 'lucide-react';
import Banner from './components/Banner';
import TipsModal from './components/TipsModal';
import Footer from './components/Footer';
import Button from './components/ui/button';
import Checkbox from './components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import FileInput from './components/ui/file-input';
import RadioGroup from './components/ui/radio-group';
import Slider from './components/ui/slider';
import { Dropdown } from './components/ui/dropdown';
import { cn } from './lib/utils';

// Map display names to API values
const CATEGORY_API_MAPPING: { [key: string]: string } = {
  "Auto": "auto",
  "Top": "tops",
  "Bottom": "bottoms",
  "Full-body": "one-pieces"
};

// Sample images for examples
const modelExamples = [
  '/models/model-example.jpg'
];

const garmentExamples = [
  '/garments/garment-example.jpg'
];

const MAX_IMAGE_HEIGHT = 2000;
const JPEG_QUALITY = 0.95;

export default function Home() {
  // Input states
  const [modelImageFile, setModelImageFile] = useState<File | null>(null);
  const [modelImagePreview, setModelImagePreview] = useState<string | null>(null);
  const [garmentImageFile, setGarmentImageFile] = useState<File | null>(null);
  const [garmentImagePreview, setGarmentImagePreview] = useState<string | null>(null);

  // API parameter states
  const [segmentationFree, setSegmentationFree] = useState(true);
  const [garmentPhotoType, setGarmentPhotoType] = useState('Auto');
  const [category, setCategory] = useState('Auto');
  const [moderationLevel, setModerationLevel] = useState('permissive');
  const [mode, setMode] = useState('Balanced');
  const [seed, setSeed] = useState<number>(42);
  const [numSamples, setNumSamples] = useState<number>(1);

  // Output states
  const [resultGallery, setResultGallery] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Advanced settings toggle
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  // Tips modal state
  const [isTipsModalOpen, setIsTipsModalOpen] = useState(false);

  // Handle file input changes
  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    setImageFile: (file: File | null) => void,
    setPreview: (preview: string | null) => void
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setPreview(null);
    }
  };

  // Load example images
  const loadExampleImage = async (
    imageUrl: string,
    setImageFile: (file: File | null) => void,
    setPreview: (preview: string | null) => void
  ) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
      const file = new File([blob], filename, { type: blob.type });
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    } catch (err) {
      console.error("Failed to load example image:", err);
      setError("Failed to load example image.");
    }
  };

  // Clear all form data
  const handleReset = () => {
    setModelImageFile(null);
    setModelImagePreview(null);
    setGarmentImageFile(null);
    setGarmentImagePreview(null);
    setResultGallery([]);
    setError(null);
    setSegmentationFree(true);
    setGarmentPhotoType('Auto');
    setCategory('Auto');
    setMode('Balanced');
    setSeed(42);
    setNumSamples(1);
  };

  /**
   * Preprocess image according to FASHN API best practices:
   * - Resize images to max height of 2000px
   * - Maintain aspect ratio
   * - Convert to JPEG with 95% quality
   */
  const preprocessImage = async (file: File): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Create image element from file to get dimensions
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        
        await new Promise((imgResolve) => {
          img.onload = () => imgResolve(null);
        });
        
        // Check if resizing is needed
        if (img.height <= MAX_IMAGE_HEIGHT) {
          // If image is already correctly sized, just convert to base64
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          return;
        }
        
        // Calculate new dimensions maintaining aspect ratio
        const aspectRatio = img.width / img.height;
        const newHeight = MAX_IMAGE_HEIGHT;
        const newWidth = Math.round(newHeight * aspectRatio);
        
        // Create canvas for resized image
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Use standard canvas API for resizing
        // Note: In production, using a library like Pica would provide better quality
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        // Get as blob with quality setting
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to convert canvas to blob'));
              return;
            }
            // Convert blob to base64
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
          },
          'image/jpeg',
          JPEG_QUALITY
        );
      } catch (error) {
        console.error('Image preprocessing failed:', error);
        reject(error);
      }
    });
  };

  // Convert file to base64 (fallback for preprocessing errors)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!modelImageFile || !garmentImageFile) {
      setError("Please select both a model and a garment image.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Preprocess images according to FASHN API best practices
      // We use base64 encoding instead of CDN URLs for simplicity in this demo
      // app, though FASHN API docs recommend using CDN-hosted images for production
      let modelImageBase64, garmentImageBase64;
      
      try {
        modelImageBase64 = await preprocessImage(modelImageFile);
        garmentImageBase64 = await preprocessImage(garmentImageFile);
      } catch (preprocessError) {
        console.warn('Image preprocessing failed, falling back to direct base64 conversion:', preprocessError);
        modelImageBase64 = await fileToBase64(modelImageFile);
        garmentImageBase64 = await fileToBase64(garmentImageFile);
      }

      const payload = {
        model_image: modelImageBase64,
        garment_image: garmentImageBase64,
        garment_photo_type: garmentPhotoType.toLowerCase(),
        category: CATEGORY_API_MAPPING[category],
        mode: mode.toLowerCase(),
        moderation_level: moderationLevel,
        segmentation_free: segmentationFree,
        seed: seed,
        num_samples: numSamples,
      };

      const response = await fetch('/api/tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `API request failed with status ${response.status}`);
      }

      setResultGallery(data.output || []);

    } catch (err: unknown) {
      console.error("Try-on error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="w-full max-w-7xl mx-auto space-y-8">
        <Banner />
        
        <div
          className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg my-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <h2 className="text-xl font-semibold">Tips for successful try-on generations</h2>
          </div>
          
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setIsTipsModalOpen(true)}
          >
            View Tips
          </Button>
          
          <TipsModal 
            isOpen={isTipsModalOpen} 
            onClose={() => setIsTipsModalOpen(false)} 
          />
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Model Image */}
            <Card colorScheme="blue">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserRound className="h-5 w-5 text-blue-500" />
                  Model Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FileInput 
                  onChange={(e) => handleImageChange(e, setModelImageFile, setModelImagePreview)}
                  accept="image/*"
                  colorScheme="blue"
                  label="Upload model image"
                />
                
                <AnimatePresence mode="wait">
                  {modelImagePreview ? (
                    <motion.div 
                      key="preview"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative"
                    >
                      <div className="aspect-[2/3] max-w-[384px] max-h-[576px] mx-auto border border-blue-200 dark:border-blue-900/50 rounded-lg shadow-sm flex items-center justify-center overflow-hidden bg-blue-50/50 dark:bg-blue-950/20">
                        <Image 
                          src={modelImagePreview} 
                          alt="Model Preview" 
                          className="max-w-full max-h-full object-contain p-2" 
                          width={384}
                          height={576}
                          unoptimized
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => {
                          setModelImageFile(null);
                          setModelImagePreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                      >
                        <X className="h-4 w-4" />
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="aspect-[2/3] max-w-[384px] max-h-[576px] mx-auto border border-dashed border-blue-200 dark:border-blue-900/50 rounded-lg flex flex-col items-center justify-center p-6 text-center bg-blue-50/50 dark:bg-blue-950/20"
                    >
                      <UserRound className="h-12 w-12 text-blue-300 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Select a model image or use an example below
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <Checkbox
                  checked={segmentationFree}
                  onChange={(e) => setSegmentationFree(e.target.checked)}
                  label="Segmentation Free"
                  description="Let the API handle segmentation automatically"
                  colorScheme="blue"
                />
                
                {modelExamples.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Examples:</h3>
                    <div className="flex flex-wrap gap-2">
                      {modelExamples.map((src, idx) => (
                        <motion.button
                          key={idx}
                          type="button"
                          onClick={() => loadExampleImage(src, setModelImageFile, setModelImagePreview)}
                          className="border border-blue-200 dark:border-blue-800 rounded-md overflow-hidden hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Image 
                            src={src} 
                            alt={`Model Example ${idx + 1}`} 
                            width={60} 
                            height={90} 
                            className="object-cover" 
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Column 2: Garment Image */}
            <Card colorScheme="green">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shirt className="h-5 w-5 text-green-500" />
                  Garment Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FileInput 
                  onChange={(e) => handleImageChange(e, setGarmentImageFile, setGarmentImagePreview)}
                  accept="image/*"
                  colorScheme="green"
                  label="Upload garment image"
                />
                
                <AnimatePresence mode="wait">
                  {garmentImagePreview ? (
                    <motion.div 
                      key="preview"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative"
                    >
                      <div className="aspect-[2/3] max-w-[384px] max-h-[576px] mx-auto border border-green-200 dark:border-green-900/50 rounded-lg shadow-sm flex items-center justify-center overflow-hidden bg-green-50/50 dark:bg-green-950/20">
                        <Image 
                          src={garmentImagePreview} 
                          alt="Garment Preview" 
                          className="max-w-full max-h-full object-contain p-2" 
                          width={384}
                          height={576}
                          unoptimized
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => {
                          setGarmentImageFile(null);
                          setGarmentImagePreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                      >
                        <X className="h-4 w-4" />
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="aspect-[2/3] max-w-[384px] max-h-[576px] mx-auto border border-dashed border-green-200 dark:border-green-900/50 rounded-lg flex flex-col items-center justify-center p-6 text-center bg-green-50/50 dark:bg-green-950/20"
                    >
                      <Shirt className="h-12 w-12 text-green-300 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Select a garment image or use an example below
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <Dropdown
                  label="Garment Settings"
                  colorScheme="green"
                  className="mt-2"
                >
                  <div className="space-y-4">
                    <RadioGroup
                      label="Photo Type"
                      name="garmentPhotoType"
                      options={[
                        { label: "Auto", value: "Auto", description: "Let the API determine the photo type" },
                        { label: "Flat-Lay", value: "Flat-Lay", description: "Garment photographed flat without a model" },
                        { label: "Model", value: "Model", description: "Garment worn by a model" }
                      ]}
                      value={garmentPhotoType}
                      onChange={setGarmentPhotoType}
                      colorScheme="green"
                      variant="card"
                      layout="vertical"
                    />
                    
                    <RadioGroup
                      label="Category"
                      name="category"
                      options={[
                        { label: "Auto", value: "Auto", description: "Automatically detect garment category" },
                        { label: "Top", value: "Top", description: "Upper body garments like shirts, tops, etc." },
                        { label: "Bottom", value: "Bottom", description: "Lower body garments like pants, skirts, etc." },
                        { label: "Full-body", value: "Full-body", description: "Full-body garments like dresses, jumpsuits, etc." }
                      ]}
                      value={category}
                      onChange={setCategory}
                      colorScheme="green"
                    />
                  </div>
                </Dropdown>
                
                {garmentExamples.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Examples:</h3>
                    <div className="flex flex-wrap gap-2">
                      {garmentExamples.map((src, idx) => (
                        <motion.button
                          key={idx}
                          type="button"
                          onClick={() => loadExampleImage(src, setGarmentImageFile, setGarmentImagePreview)}
                          className="border border-green-200 dark:border-green-800 rounded-md overflow-hidden hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Image 
                            src={src} 
                            alt={`Garment Example ${idx + 1}`} 
                            width={60} 
                            height={90} 
                            className="object-cover" 
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Column 3: Results and Controls */}
            <Card colorScheme="purple">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Try-On Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isLoading || !modelImageFile || !garmentImageFile}
                    loading={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? 'Generating...' : 'Run Try-On'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="px-3"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                
                <RadioGroup
                  label="Run Mode"
                  name="mode"
                  options={[
                    { label: "Performance", value: "Performance", description: "Faster generation with good quality" },
                    { label: "Balanced", value: "Balanced", description: "Good balance between speed and quality" },
                    { label: "Quality", value: "Quality", description: "Highest quality but slower generation" }
                  ]}
                  value={mode}
                  onChange={setMode}
                  colorScheme="purple"
                  variant="card"
                  layout="horizontal"
                />
                
                <motion.div
                  animate={{ height: showAdvancedSettings ? 'auto' : '0px', opacity: showAdvancedSettings ? 1 : 0 }}
                  className={cn(
                    "space-y-4 overflow-hidden", 
                    !showAdvancedSettings && "pointer-events-none"
                  )}
                >
                  <Slider
                    min={1}
                    max={4}
                    step={1}
                    value={numSamples}
                    onChange={setNumSamples}
                    label="Number of Samples"
                    colorScheme="purple"
                  />
                  
                  <div className="relative">
                    <label htmlFor="seed" className="block text-sm font-medium mb-1">
                      Seed
                    </label>
                    <input
                      type="number"
                      id="seed"
                      min={0}
                      value={seed}
                      onChange={(e) => setSeed(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <RadioGroup
                    label="Content Moderation"
                    name="moderationLevel"
                    options={[
                      { label: "None", value: "none", description: "No content moderation" },
                      { label: "Permissive", value: "permissive", description: "Moderate filtering of inappropriate content" },
                      { label: "Conservative", value: "conservative", description: "Strict filtering of inappropriate content" }
                    ]}
                    value={moderationLevel}
                    onChange={setModerationLevel}
                    colorScheme="purple"
                    layout="vertical"
                    size="sm"
                  />
                </motion.div>
                
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  className="w-full text-sm flex justify-center items-center gap-1"
                >
                  <Settings className="h-4 w-4" />
                  {showAdvancedSettings ? 'Hide' : 'Show'} Advanced Settings
                </Button>
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded-md"
                  >
                    <div className="flex items-start gap-2">
                      <X className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </div>
                  </motion.div>
                )}
                
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-10 text-center space-y-4"
                    >
                      <div className="relative">
                        <div className="h-16 w-16 rounded-full border-4 border-purple-100 dark:border-purple-900/30 border-t-purple-600 animate-spin" />
                        <Sparkles className="h-6 w-6 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">
                        Generating your virtual try-on...
                      </p>
                    </motion.div>
                  ) : resultGallery.length > 0 ? (
                    <motion.div 
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      {resultGallery.map((url, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1,
                            transition: { delay: index * 0.1 }
                          }}
                          className="relative group"
                        >
                          <div className="aspect-[2/3] border border-purple-200 dark:border-purple-900/50 rounded-lg shadow-sm flex items-center justify-center overflow-hidden bg-purple-50/50 dark:bg-purple-950/20">
                            <Image 
                              src={url} 
                              alt={`Result ${index + 1}`} 
                              className="max-w-full max-h-full object-contain p-2" 
                              width={384}
                              height={576}
                              unoptimized
                            />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <a 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bg-black/70 text-white py-2 px-4 rounded-full text-sm flex items-center gap-1"
                              download
                            >
                              <Zap className="h-4 w-4" />
                              Download
                            </a>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="aspect-[2/3] max-w-[384px] mx-auto border border-dashed border-purple-200 dark:border-purple-900/50 rounded-lg flex flex-col items-center justify-center p-6 text-center bg-purple-50/50 dark:bg-purple-950/20"
                    >
                      <Sparkles className="h-12 w-12 text-purple-300 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Your try-on results will appear here
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </form>
        
        <Footer />
      </div>
    </div>
  );
}