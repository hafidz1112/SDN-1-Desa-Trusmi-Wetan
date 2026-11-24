'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  unoptimized?: boolean;
  fallbackSrc?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  className = '',
  fill = false,
  width,
  height,
  priority = false,
  unoptimized,
  fallbackSrc = '/images/placeholder.svg',
}: ImageWithFallbackProps) {
  const [prevSrc, setPrevSrc] = useState(src);
  const [error, setError] = useState(false);

  if (prevSrc !== src) {
    setPrevSrc(src);
    setError(false);
  }

  const imageSrc = !src || error ? fallbackSrc : src;
  const isLocalMedia = typeof imageSrc === 'string' && (imageSrc.startsWith('/api/media') || imageSrc.startsWith('/uploads'));
  const shouldUnoptimize = unoptimized ?? isLocalMedia;

  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt || 'Foto SDN 1 Trusmi Wetan'}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={className}
        priority={priority}
        unoptimized={shouldUnoptimize}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt || 'Foto SDN 1 Trusmi Wetan'}
      width={width || 600}
      height={height || 400}
      className={className}
      priority={priority}
      unoptimized={shouldUnoptimize}
      onError={() => setError(true)}
    />
  );
}
