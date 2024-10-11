import React from 'react';
import { format, differenceInMinutes, differenceInHours } from 'date-fns';
import { ko } from 'date-fns/locale';
import ThunderBadge from '../thunder/ThunderBadge';
import { MdOutlineStickyNote2 } from 'react-icons/md';

interface UpdateCardProps {
  id: string;
  category: string;
  title: string;
  content: string;
  description: string;
  createdAt: string;
  image_url: string;
}

const UpdateCard: React.FC<UpdateCardProps> = ({ category, title, content, description, createdAt }) => {
  const isValidDate = (date: Date): boolean => {
    return date instanceof Date && !isNaN(date.getTime());
  };

  const formatCreatedAt = (createdAt: string): string => {
    const date = new Date(createdAt);
    const now = new Date();

    if (!isValidDate(date)) {
      return '유효하지 않은 날짜';
    }

    const minutesDifference = differenceInMinutes(now, date);
    const hoursDifference = differenceInHours(now, date);

    if (minutesDifference < 1) {
      return '방금 전';
    } else if (minutesDifference < 60) {
      return `${minutesDifference}분 전`;
    } else if (hoursDifference < 24) {
      return `${hoursDifference}시간 전`;
    } else {
      return format(date, 'M월 d일 ', { locale: ko });
    }
  };

  const formattedCreatedAt = formatCreatedAt(createdAt);

  return (
    <div className="flex w-full flex-col overflow-y-scroll bg-gray-100 p-4 px-4 opacity-100 backdrop-blur-2xl transition-colors duration-200 hover:bg-gray-100 active:bg-gray-200">
      <div className="flex h-full items-center rounded-[10px] p-2">
        <div className="flex h-full grow flex-col justify-between gap-1">
          <h2 className="line-clamp-2 text-[20px] font-medium text-black xs:text-[16px]">
            <MdOutlineStickyNote2 className="mr-2 inline" /> {/* 아이콘 추가 */}
            {title}
          </h2>
          <div className="flex gap-2 text-black">
            <ThunderBadge type="category" label={category} />
          </div>
          <p className="line-clamp-1 text-[16px] text-black xs:text-[14px]">{content}</p>
          <p className="text-[16px] text-black xs:text-[14px]">{description}</p>
          <div className="flex items-center justify-between text-[#666666]">
            <div className="flex items-center gap-1">
              <div className="text-[14px] text-black xs:text-[14px]">{formattedCreatedAt}</div>
            </div>
            <span className="flex gap-1" />
          </div>
        </div>
      </div>
      <div className="h-[1px] w-full bg-gray-200" />
    </div>
  );
};

export default UpdateCard;
