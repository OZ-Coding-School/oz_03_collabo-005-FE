import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThunderBadge from './ThunderBadge';
import { formatAppointmentTime } from '../../utils/formatAppointmentTime';

// ThunderCard 컴포넌트의 props 타입 정의
interface ThunderCardProps {
  id: string;
  meeting_image_url: string | null;
  description: string;
  paymentMethod: string;
  appointmentTime: string;
  title: string;
  genderGroup: string;
  ageGroup: string;
  locationName: string;
}

// ThunderCard 컴포넌트 정의
const ThunderCard: React.FC<ThunderCardProps> = ({
  id,
  meeting_image_url,
  description,
  paymentMethod,
  appointmentTime,
  title,
  genderGroup,
  ageGroup,
  locationName,
}) => {
  // 이미지 로딩 상태 관리를 위한 state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 기본 이미지 URL 설정
  const defaultImageUrl = '/images/CuteEgg.svg';

  // 약속 시간 포맷팅
  const formattedTime = appointmentTime ? formatAppointmentTime(appointmentTime) : '날짜 없음';

  // 이미지 에러 처리 함수
  const handleImageError = () => setImageError(true);

  // 이미지 로드 완료 처리 함수
  const handleImageLoad = () => setImageLoaded(true);

  return (
    // Thunder/{uuid} - detail 상세 페이지로 이동하는 링크
    <Link
      to={`/thunder/${id}`} // {uuid}
      className="flex w-full flex-col px-2 transition-colors duration-200 hover:bg-gray-100 active:bg-gray-200">
      <div className="my-2 flex h-full items-center">
        {/* Thunder 이미지 section */}
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
        {/* Thunder 정보 section */}
        <div className="ml-4 flex h-full grow flex-col justify-between gap-1">
          <h2 className="line-clamp-2 text-[20px] font-medium xs:text-[16px]">{title}</h2>

          {/* ThunderBadge section */}
          <div className="flex gap-2 xs:flex-wrap">
            <ThunderBadge label={locationName} type="location" />
            <ThunderBadge label={paymentMethod} type="payment" />
            <ThunderBadge label={genderGroup} type="gender" />
            <ThunderBadge label={ageGroup} type="age" />
          </div>
          {/* 약속 시간 표시 */}
          <div className="text-[16px] xs:text-[14px]">{formattedTime}</div>
          {/* Thunder 설명 */}
          <p className="line-clamp-2 text-[16px] xs:text-[14px]">{description}</p>
        </div>
      </div>
      {/* 구분선 */}
      <div className="h-[1px] w-full bg-gray-200" />
    </Link>
  );
};

export default ThunderCard;
