'use client';

// apps/web/src/components/MDContent/ImageBlock.tsx
import React from 'react';

import Image from 'next/image';

interface ImageBlockProps {
  src?: string;
  alt?: string;
}

const ImageBlock = ({ src, alt }: ImageBlockProps) => {
  if (!src) return null;

  const isExternal = true; // ex: !src.startsWith('https://devarchive-image-bucket.s3');

  const openImage = () => {
    if (src) window.open(src, '_blank', 'noopener');
  };

  return (
    <a onClick={openImage} className="block relative w-full aspect-[4/3] hover:cursor-pointer hover:opacity-70">
      {!isExternal ? (
        <Image src={src} alt={alt || 'Image'} fill style={{ objectFit: 'contain' }} />
      ) : (
        <img src={src} alt={alt || 'Image'} className="h-full object-contain mx-auto" />
      )}
    </a>
  );
};

export default ImageBlock;
