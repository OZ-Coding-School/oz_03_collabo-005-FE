import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from './Badge';
import { formatAppointmentTime } from '../../utils/formatAppointmentTime';

interface ThunderCardProps {
  id: string;
  meeting_image_url: string | null;
  description: string;
  paymentMethod: string;
  appointmentTime: string;
  title: string;
  genderGroup: string;
  ageGroup: string;
}

const ThunderCard: React.FC<ThunderCardProps> = ({
  id,
  meeting_image_url,
  description,
  paymentMethod,
  appointmentTime,
  title,
  genderGroup,
  ageGroup,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const defaultImageUrl = '/images/CuteEgg.svg';
  const formattedTime = formatAppointmentTime(appointmentTime);
  const handleImageError = () => setImageError(true);
  const handleImageLoad = () => setImageLoaded(true);

  return (
    <Link
      to={`/thunder/${id}`}
      className="flex w-full flex-col px-2 transition-colors duration-200 hover:bg-gray-100 active:bg-gray-200">
      <div className="my-2 flex h-full items-center">
        <div className="flex-shrink-0">
          <div className="relative h-[140px] w-[140px] overflow-hidden rounded-[10px] xs:h-[120px] xs:w-[120px]">
            <img
              className={`block h-full w-full object-cover transition-transform duration-200 ${
                imageLoaded ? 'block' : 'hidden'
              } hover:scale-105`}
              src={imageError || !meeting_image_url ? defaultImageUrl : meeting_image_url}
              alt={title}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        </div>
        <div className="ml-4 flex h-full grow flex-col justify-between gap-1">
          <h2 className="line-clamp-2 text-[20px] font-medium xs:text-[16px]">{title}</h2>
          <div className="flex gap-2">
            <Badge label={paymentMethod} />
            <Badge label={genderGroup} />
            <Badge label={ageGroup} />
          </div>
          <div className="text-[16px] xs:text-[14px]">{formattedTime}</div>
          <p className="line-clamp-2 text-[16px] xs:text-[14px]">{description}</p>
        </div>
      </div>
      <div className="h-[1px] w-full bg-gray-200" />
    </Link>
  );
};

export default ThunderCard;
