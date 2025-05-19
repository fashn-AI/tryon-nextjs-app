'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import Banner from './components/Banner';
import Tips from './components/Tips';
import Footer from './components/Footer';

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
    setResultGallery([]);

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
        garment_photo_type: garmentPhotoType,
        category: CATEGORY_API_MAPPING[category],
        mode: mode,
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
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#121212] py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <Banner />
        <Tips />

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Model Image */}
            <div className="space-y-4 p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
              <h2 className="text-xl font-semibold">Model Image</h2>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setModelImageFile, setModelImagePreview)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {modelImagePreview && (
                <div className="max-w-[384px] max-h-[576px] mx-auto border border-gray-200 dark:border-gray-700 flex items-center justify-center aspect-[2/3] overflow-hidden">
                  <Image 
                    src={modelImagePreview} 
                    alt="Model Preview" 
                    className="max-w-full max-h-full object-contain" 
                    width={384}
                    height={576}
                    unoptimized
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="segmentationFree"
                  checked={segmentationFree}
                  onChange={(e) => setSegmentationFree(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="segmentationFree" className="text-sm">Segmentation Free</label>
              </div>
              {modelExamples.length > 0 && (
                <div>
                  <h3 className="text-md font-medium mb-2">Examples:</h3>
                  <div className="flex flex-wrap gap-2">
                    {modelExamples.map((src, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => loadExampleImage(src, setModelImageFile, setModelImagePreview)}
                        className="p-1 border rounded hover:border-blue-500"
                      >
                        <Image src={src} alt={`Model Example ${idx + 1}`} width={60} height={90} className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Column 2: Garment Image */}
            <div className="space-y-4 p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
              <h2 className="text-xl font-semibold">Garment Image</h2>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setGarmentImageFile, setGarmentImagePreview)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              {garmentImagePreview && (
                <div className="max-w-[384px] max-h-[576px] mx-auto border border-gray-200 dark:border-gray-700 flex items-center justify-center aspect-[2/3] overflow-hidden">
                  <Image 
                    src={garmentImagePreview} 
                    alt="Garment Preview" 
                    className="max-w-full max-h-full object-contain" 
                    width={384}
                    height={576}
                    unoptimized
                  />
                </div>
              )}
              <div>
                <h3 className="text-md font-medium">Photo Type:</h3>
                {["Auto", "Flat-Lay", "Model"].map(type => (
                  <label key={type} className="inline-flex items-center mr-4">
                    <input 
                      type="radio" 
                      name="garmentPhotoType" 
                      value={type} 
                      checked={garmentPhotoType === type} 
                      onChange={(e) => setGarmentPhotoType(e.target.value)} 
                      className="form-radio h-4 w-4 text-green-600" 
                    />
                    <span className="ml-2 text-sm">{type}</span>
                  </label>
                ))}
              </div>
              <div>
                <h3 className="text-md font-medium">Category:</h3>
                {Object.keys(CATEGORY_API_MAPPING).map(cat => (
                  <label key={cat} className="inline-flex items-center mr-4">
                    <input 
                      type="radio" 
                      name="category" 
                      value={cat} 
                      checked={category === cat} 
                      onChange={(e) => setCategory(e.target.value)} 
                      className="form-radio h-4 w-4 text-green-600" 
                    />
                    <span className="ml-2 text-sm">{cat}</span>
                  </label>
                ))}
              </div>
              <div>
                <h3 className="text-md font-medium">Content Moderation:</h3>
                {["none", "permissive", "conservative"].map(level => (
                  <label key={level} className="inline-flex items-center mr-4">
                    <input 
                      type="radio" 
                      name="moderationLevel" 
                      value={level} 
                      checked={moderationLevel === level} 
                      onChange={(e) => setModerationLevel(e.target.value)} 
                      className="form-radio h-4 w-4 text-green-600" 
                    />
                    <span className="ml-2 text-sm capitalize">{level}</span>
                  </label>
                ))}
              </div>
              {garmentExamples.length > 0 && (
                <div>
                  <h3 className="text-md font-medium mb-2">Examples:</h3>
                  <div className="flex flex-wrap gap-2">
                    {garmentExamples.map((src, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => loadExampleImage(src, setGarmentImageFile, setGarmentImagePreview)}
                        className="p-1 border rounded hover:border-green-500"
                      >
                        <Image src={src} alt={`Garment Example ${idx + 1}`} width={60} height={90} className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Column 3: Results and Controls */}
            <div className="space-y-4 p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
              <h2 className="text-xl font-semibold">Try-On Results</h2>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:opacity-50 transition duration-150"
              >
                {isLoading ? 'Generating...' : 'Run'}
              </button>
              <div>
                <h3 className="text-md font-medium">Run Mode:</h3>
                {["Performance", "Balanced", "Quality"].map(m => (
                  <label key={m} className="inline-flex items-center mr-4">
                    <input 
                      type="radio" 
                      name="mode" 
                      value={m} 
                      checked={mode === m} 
                      onChange={(e) => setMode(e.target.value)} 
                      className="form-radio h-4 w-4 text-purple-600" 
                    />
                    <span className="ml-2 text-sm">{m}</span>
                  </label>
                ))}
              </div>
              <div className="flex items-center space-x-4">
                <label htmlFor="seed" className="text-sm font-medium">Seed:</label>
                <input
                  type="number"
                  id="seed"
                  value={seed}
                  onChange={(e) => setSeed(parseInt(e.target.value, 10))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="numSamples" className="block text-sm font-medium">
                  Number of Samples: {numSamples}
                </label>
                <input
                  type="range"
                  id="numSamples"
                  min="1"
                  max="4"
                  step="1"
                  value={numSamples}
                  onChange={(e) => setNumSamples(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {isLoading && <p className="text-blue-500 text-sm">Loading results, this may take a moment...</p>}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {resultGallery.map((url, index) => (
                  <div key={index} className="max-w-[384px] max-h-[576px] mx-auto border border-gray-200 dark:border-gray-700 flex items-center justify-center aspect-[2/3] overflow-hidden">
                    <Image 
                      src={url} 
                      alt={`Result ${index + 1}`} 
                      className="max-w-full max-h-full object-contain" 
                      width={384}
                      height={576}
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
        <Footer />
      </div>
    </div>
  );
}
