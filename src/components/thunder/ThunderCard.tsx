import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from './Badge';
import { formatAppointmentTime } from '../../utils/formatAppointmentTime';

interface ThunderCardProps {
  id: string;
  meeting_image_url: string;
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
  const defaultImageUrl = '/images/CuteEgg.svg';
  const formattedTime = formatAppointmentTime(appointmentTime);

  return (
    <Link
      to={`/thunder/${id}`}
      className="flex w-full flex-col transition-colors duration-200 hover:bg-gray-100 active:bg-gray-200">
      <div className="my-2 flex h-full items-center">
        <div className="flex-shrink-0">
          {!imageLoaded && (
            <div className="block h-[140px] w-[140px] rounded-[10px] bg-gray-300 xs:h-[120px] xs:w-[120px]" />
          )}
          <img
            className={`block h-[140px] w-[140px] rounded-[10px] object-cover xs:h-[120px] xs:w-[120px] ${
              imageLoaded ? 'block' : 'hidden'
            }`}
            src={meeting_image_url || defaultImageUrl}
            alt={title}
            onError={(e) => {
              e.currentTarget.src = defaultImageUrl;
            }}
            onLoad={() => setImageLoaded(true)}
          />
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
