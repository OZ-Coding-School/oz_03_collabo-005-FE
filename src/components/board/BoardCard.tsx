import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format, differenceInMinutes, differenceInHours } from 'date-fns';
import { ko } from 'date-fns/locale';
import Badge from '../thunder/Badge';
import { LuDot } from 'react-icons/lu';

interface BoardCardProps {
  id: number;
  category: string;
  title: string;
  content: string;
  hits: number;
  image_url?: string[];
  createdAt: string;
  commentLength: number;
}

const BoardCard: React.FC<BoardCardProps> = ({
  id,
  category,
  title,
  content,
  hits,
  image_url = [], // 기본값을 빈 배열로 설정
  createdAt,
  commentLength,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const defaultImageUrl = '/images/CuteEgg.svg';

  const isValidDate = (date: Date) => !isNaN(date.getTime());

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
    <Link to={`/board/${id}`} className="mt-4 flex w-full flex-col">
      <div className="my-1 flex h-full items-center">
        <div className="flex-shrink-0">
          {!imageLoaded && (
            <div className="block h-[140px] w-[140px] rounded-[10px] bg-gray-300 xs:h-[120px] xs:w-[120px]" />
          )}
          <img
            className={`block h-[140px] w-[140px] rounded-[10px] object-cover xs:h-[120px] xs:w-[120px] ${
              imageLoaded ? 'block' : 'hidden'
            }`}
            src={image_url[0] || defaultImageUrl}
            alt={title}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <div className="ml-4 flex h-full grow flex-col justify-between gap-1">
          <h2 className="text-[20px] font-medium xs:text-[16px]">{title}</h2>
          <div className="flex gap-2">
            <Badge label={category} />
          </div>
          <p className="line-clamp-1 text-[16px] xs:text-[14px]">{content}</p>
          <div className="flex items-center justify-between text-[#666666]">
            <div className="flex items-center gap-1">
              <div className="text-[14px] xs:text-[14px]">{formattedCreatedAt}</div>
              <LuDot />
              <span className="text-[14px] xs:text-[12px]">조회수 {hits}</span>
            </div>
            <span className="flex gap-1">
              <img src="/images/CommentIcon.svg" alt="comments icon" />
              {commentLength}
            </span>
          </div>
        </div>
      </div>
      <div className="h-[1px] w-full bg-gray-200" />
    </Link>
  );
};

export default BoardCard;
