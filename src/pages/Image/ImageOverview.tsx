import React from 'react';
import { useLocation } from 'react-router-dom';

const ImageOverview: React.FC = () => {
  const location = useLocation();
  const { src, alt } = location.state || {};

  return (
    <div className="flex h-[calc(100vh-150px)] items-center justify-center">
      <img src={src} alt={alt || 'Image'} className="max-h-full max-w-full" />
    </div>
  );
};

export default ImageOverview;
