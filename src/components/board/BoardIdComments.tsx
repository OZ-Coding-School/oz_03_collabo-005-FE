import React from 'react';
import { Link } from 'react-router-dom';
import { IoMdMore } from 'react-icons/io';
import { formatCreatedAt } from '../../utils/formatCreatedAt';

// 댓글 객체의 Interface 정의
interface Comment {
  id: number;
  text: string;
  timestamp: Date;
  nickname?: string;
  profile_image_url?: string;
  is_host: boolean;
}

// BoardIdComments - Components props -  Interface 정의
interface BoardIdCommentsProps {
  comments: Comment[];
  profileImageUrl: string;
  setCommentToEdit: (index: number | null) => void;
  setEditCommentText: (text: string) => void;
  toggleBottomModal: () => void;
  commentsEndRef: React.RefObject<HTMLDivElement>;
}

// BoardIdComments Components 정의
const BoardIdComments: React.FC<BoardIdCommentsProps> = ({
  comments,
  setCommentToEdit,
  setEditCommentText,
  toggleBottomModal,
  commentsEndRef,
}) => {
  return (
    <div className="mb-[72px] mt-[10px] flex flex-col items-center overflow-auto">
      {/* 댓글 수 표시 */}
      <div className="mb-[15px] w-full text-left text-sm text-black">댓글 {comments.length}</div>
      {/* 댓글 목록 렌더링*/}
      {comments.map((comment, index) => {
        const timeDisplay = formatCreatedAt(comment.timestamp.toString());
        return (
          <div key={index} className="flex w-full items-center border-b border-gray-300 p-2">
            {/* 프로필 이미지 링크 */}
            <Link to={`/profile/${comment.nickname}`}>
              <img
                src={comment.profile_image_url || '/images/anonymous_avatars.svg'}
                alt="프로필 이미지"
                className="mb-[28px] mr-2 h-8 w-8 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = '/images/anonymous_avatars.svg';
                }}
              />
            </Link>
            <div>
              {/* 닉네임 링크 */}
              <Link to={`/profile/${comment.nickname}`} className="font-normal">
                {comment.nickname}
              </Link>
              {/* 댓글 작성 시간 */}
              <div className="text-sm text-gray-500">{timeDisplay}</div>
              {/* 댓글 내용 */}
              <div>{comment.text}</div>
            </div>
            {/* 더보기 버튼 */}
            <button
              className={`mb-[24px] ml-auto p-2 text-gray-400`}
              title="더보기"
              onClick={() => {
                setCommentToEdit(index);
                setEditCommentText(comment.text);
                toggleBottomModal();
              }}>
              <IoMdMore size={28} />
            </button>
          </div>
        );
      })}
      {/* 댓글 목록 끝 참조하는 div */}
      <div ref={commentsEndRef} />
    </div>
  );
};

export default BoardIdComments;
