import React, { useState } from 'react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  className,
  style
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      style={{
        ...style,
        transition: 'opacity 0.3s ease-in-out'
      }}
      onLoad={() => setIsLoaded(true)}
    />
  );
};

export default ProgressiveImage;
