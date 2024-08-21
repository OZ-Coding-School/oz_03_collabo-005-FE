import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string;
  alt: string;
}

const Image: React.FC<ImageProps> = (props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/image', { state: { src: props.src, alt: props.alt } });
  };

  return <img {...props} onClick={handleClick} className={`cursor-pointer ${props.className || ''}`} />;
};

export default Image;
