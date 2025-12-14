import React, { useState } from 'react';
import { FiImage } from 'react-icons/fi';

/**
 * SafeImage Component
 * Image with error handling and fallback
 * Prevents spam requests on 404
 */
export const SafeImage = ({ 
  src, 
  alt = 'Image', 
  fallbackSrc = null,
  className = '',
  fallbackClassName = '',
  onError = null,
  ...props 
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleError = (e) => {
    console.warn(`Failed to load image: ${src}`);
    setError(true);
    setLoading(false);
    
    // Call custom error handler if provided
    if (onError) {
      onError(e);
    }
  };

  const handleLoad = () => {
    setLoading(false);
  };

  // If error and no fallback, show placeholder
  if (error && !fallbackSrc) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 ${fallbackClassName || className}`}
        {...props}
      >
        <div className="text-center">
          <FiImage className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-xs text-gray-500">Gambar tidak tersedia</p>
        </div>
      </div>
    );
  }

  // If error but has fallback, try fallback
  if (error && fallbackSrc) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        className={className}
        onError={() => {
          console.warn(`Fallback image also failed: ${fallbackSrc}`);
          setError(true);
        }}
        {...props}
      />
    );
  }

  // Normal image with loading state
  return (
    <>
      {loading && (
        <div 
          className={`flex items-center justify-center bg-gray-200 animate-pulse ${className}`}
          {...props}
        >
          <div className="text-gray-400">
            <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
                fill="none"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loading ? 'hidden' : 'block'}`}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </>
  );
};

/**
 * SafeImageGallery Component
 * For rendering multiple images with error handling
 */
export const SafeImageGallery = ({ 
  images = [], 
  className = '',
  itemClassName = '',
  alt = 'Gallery Image',
  fallbackSrc = null 
}) => {
  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8">
        <div className="text-center">
          <FiImage className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Tidak ada foto</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {images.map((image, index) => (
        <SafeImage
          key={image.id || index}
          src={image.url_gambar || image}
          alt={`${alt} ${index + 1}`}
          className={itemClassName}
          fallbackSrc={fallbackSrc}
        />
      ))}
    </div>
  );
};
