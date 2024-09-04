import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string;
  alt: string;
}

const Image: React.FC<ImageProps> = (props) => {
  const [imgSrc, setImgSrc] = useState(props.src); // 이미지 소스를 상태로 관리
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/image', { state: { src: imgSrc, alt: props.alt } });
  };

  const handleError = () => {
    // 이미지 로드 실패 시 기본 이미지로 변경
    setImgSrc('/images/anonymous_avatars.svg');
  };

  return (
    <img
      {...props}
      src={imgSrc}
      onClick={handleClick}
      onError={handleError} // 이미지 로드 실패 시 handleError 호출
      className={`cursor-pointer ${props.className || ''}`}
      alt={props.alt}
    />
  );
};

export default Image;
