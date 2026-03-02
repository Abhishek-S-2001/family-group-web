'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Image as ImageIcon, Loader2 } from 'lucide-react';

interface SecureImageProps {
  imagePath: string;
  alt?: string;
  className?: string;
}

export default function SecureImage({ imagePath, alt = 'Secure memory', className = '' }: SecureImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      try {
        // Request a temporary URL that expires in 1 hour (3600 seconds)
        const { data, error } = await supabase.storage
          .from('group-media')
          .createSignedUrl(imagePath, 3600);

        if (error) throw error;

        if (isMounted && data) {
          setImgSrc(data.signedUrl);
        }
      } catch (error) {
        console.error('Error downloading image: ', error);
        if (isMounted) setHasError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchImage();

    // Cleanup function to prevent setting state on unmounted components
    return () => {
      isMounted = false;
    };
  }, [imagePath]);

  // --- RENDER STATES ---

  if (isLoading) {
    return (
      <div className={`w-full aspect-square bg-gray-50 flex items-center justify-center border-y border-gray-50 ${className}`}>
        <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (hasError || !imgSrc) {
    return (
      <div className={`w-full aspect-square bg-gray-50 flex flex-col items-center justify-center text-gray-400 border-y border-gray-50 ${className}`}>
        <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
        <span className="text-xs font-medium">Image unavailable</span>
      </div>
    );
  }

  return (
    // We use a standard <img> tag here instead of Next.js <Image> 
    // because Signed URLs change constantly and bypass Next.js image optimization.
    <img
      src={imgSrc}
      alt={alt}
      className={`w-full h-auto object-cover border-y border-gray-50 ${className}`}
      loading="lazy"
    />
  );
}