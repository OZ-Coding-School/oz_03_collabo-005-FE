import React from 'react';
import { Link } from 'react-router-dom';
import { format, isToday, isThisWeek, addWeeks, startOfWeek, endOfWeek, StartOfWeekOptions } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ThunderCardProps {
  id: number;
  imageUrl?: string;
  description: string;
  paymentMethod: string;
  appointmentTime: string;
  title: string;
  genderGroup: string;
  ageGroup: string;
}

const ThunderCard: React.FC<ThunderCardProps> = ({
  id,
  imageUrl,
  description,
  paymentMethod,
  appointmentTime,
  title,
  genderGroup,
  ageGroup,
}) => {
  const defaultImageUrl = '/images/CuteEgg.svg';

  const isNextWeek = (date: Date, options: StartOfWeekOptions = { weekStartsOn: 1 }): boolean => {
    // 다음 주의 시작
    const nextWeekStart = startOfWeek(addWeeks(new Date(), 1), options);
    // 다음 주의 끝
    const nextWeekEnd = endOfWeek(addWeeks(new Date(), 1), options);
    // date가 다음주의 시작~끝 사이에 있으면 다음주에 포함됨으로 true 반환
    return date >= nextWeekStart && date <= nextWeekEnd;
  };

  const formatAppointmentTime = (appointmentTime: string): string => {
    const date = new Date(appointmentTime);
    if (isToday(date)) {
      // a: 오전오후, eeee: 요일(한글로 표기하기위해 locale:ko, h: 시간, mm: 분
      return `오늘 ${format(date, 'a h:mm', { locale: ko })}`;
    } else if (isThisWeek(date, { weekStartsOn: 1 })) {
      return `이번 주 ${format(date, 'eeee, a h:mm', { locale: ko })}`;
    } else if (isNextWeek(date, { weekStartsOn: 1 })) {
      return `다음 주 ${format(date, 'eeee, a h:mm', { locale: ko })}`;
    } else {
      return format(date, 'M월 d일 eeee, a h:mm', { locale: ko });
    }
  };

  const formattedTime = formatAppointmentTime(appointmentTime);

  return (
    <Link to={`/thunder/${id}`} className="flex w-full flex-col">
      <div className="my-2 flex h-full items-center">
        <div className="flex-shrink-0">
          <img
            className="block h-[140px] w-[140px] rounded-[8px] object-cover xs:h-[120px] xs:w-[120px]"
            src={imageUrl || defaultImageUrl}
            alt={title}
          />
        </div>
        <div className="ml-4 flex h-full grow flex-col justify-between gap-1">
          <h2 className="text-[20px] font-medium xs:text-[16px]">{title}</h2>
          <div className="flex gap-2">
            <Badge label={paymentMethod} />
            <Badge label={genderGroup} />
            <Badge label={ageGroup} />
          </div>
          <div className="text-[16px] xs:text-[14px]">{formattedTime}</div>
          <p className="line-clamp-2 text-[16px] xs:text-[14px]">{description}</p>
        </div>
      </div>
      <div className="h-[1px] w-full bg-gray-200"></div>
    </Link>
  );
};

export default ThunderCard;

interface BadgeProps {
  label: string;
}

const Badge: React.FC<BadgeProps> = ({ label }) => (
  <span className="flex items-center justify-center rounded border border-solid bg-black bg-opacity-5 px-[6px] py-[1px] text-[14px] xs:px-[4px] xs:py-[2px] xs:text-[12px]">
    {label}
  </span>
);
