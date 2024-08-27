import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../thunder/Badge';
import { LuDot } from 'react-icons/lu';
import { formatCreatedAt } from '../../utils/formatCreatedAt';

interface BoardCardProps {
  id: number;
  category: string;
  title: string;
  content: string;
  hits: number;
  thumbnail: string;
  createdAt: string;
  commentLength: number;
}

const BoardCard: React.FC<BoardCardProps> = ({
  id,
  category,
  title,
  content,
  hits,
  thumbnail,
  createdAt,
  commentLength,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const defaultImageUrl = '/images/CuteEgg.svg';
  const formattedCreatedAt = formatCreatedAt(createdAt);

  return (
    <Link to={`/board/${id}`} className="flex w-full flex-col">
      <div className="my-2 flex h-full items-center">
        <div className="flex-shrink-0">
          {!imageLoaded && (
            <div className="block h-[140px] w-[140px] rounded-[10px] bg-gray-300 xs:h-[120px] xs:w-[120px]"></div>
          )}
          <img
            className={`block h-[140px] w-[140px] rounded-[10px] object-cover xs:h-[120px] xs:w-[120px] ${
              imageLoaded ? 'block' : 'hidden'
            }`}
            src={thumbnail || defaultImageUrl}
            alt={title}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <div className="ml-4 flex h-full grow flex-col justify-between gap-1">
          <h2 className="line-clamp-2 text-[20px] font-medium xs:text-[16px]">{title}</h2>
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
      <div className="h-[1px] w-full bg-gray-200"></div>
    </Link>
  );
};

export default BoardCard;
