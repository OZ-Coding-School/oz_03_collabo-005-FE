import { useState } from 'react';

interface ImageWithPlaceholderProps {
  src: string;
  alt: string;
}

const ImageWithPlaceholder: React.FC<ImageWithPlaceholderProps> = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-gray-200 pt-[100%]">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4" role="status" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`absolute left-0 top-0 h-full w-full rounded-lg object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

export default ImageWithPlaceholder;
