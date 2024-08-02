'use client';

// apps/web/src/components/MDContent/ImageBlock.tsx
import React from 'react';

import Zoom from 'react-medium-image-zoom';

import 'react-medium-image-zoom/dist/styles.css';

interface ImageBlockProps {
  src?: string;
  alt?: string;
}

const ImageBlock = ({ src, alt }: ImageBlockProps) => {
  if (!src) return null;

  return (
    <Zoom wrapElement="span">
      <img src={src} alt={alt || 'Image'} className="object-contain max-h-[50vh] mx-auto" />
    </Zoom>
  );
};

export default ImageBlock;
