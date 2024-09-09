import React from 'react';
import { Link } from 'react-router-dom';
import { IoMdMore } from 'react-icons/io';

interface Comment {
  id: number;
  text: string;
  timestamp: Date;
  nickname?: string;
  profile_image_url?: string;
}

interface BoardCommentsProps {
  comments: Comment[];
  profileImageUrl: string;
  setCommentToEdit: (index: number | null) => void;
  setEditCommentText: (text: string) => void;
  toggleBottomModal: () => void;
  commentsEndRef: React.RefObject<HTMLDivElement>;
}

// BoardComments 를 위한 컴포넌트.
const BoardComments: React.FC<BoardCommentsProps> = ({
  comments,
  setCommentToEdit,
  setEditCommentText,
  toggleBottomModal,
  commentsEndRef,
}) => {
  return (
    <div className="mb-[72px] mt-[10px] flex flex-col items-center overflow-auto">
      <div className="mb-[15px] w-full text-left text-sm text-black">댓글 {comments.length}</div>
      {comments.map((comment, index) => {
        const now = new Date();
        const commentTime = new Date(comment.timestamp);
        const minutesDifference = Math.floor((now.getTime() - commentTime.getTime()) / 1000 / 60);

        let timeDisplay;
        if (minutesDifference < 1) {
          timeDisplay = '방금 전';
        } else if (minutesDifference < 60) {
          timeDisplay = `${minutesDifference}분 전`;
        } else if (minutesDifference < 1440) {
          timeDisplay = `${Math.floor(minutesDifference / 60)}시간 전`;
        } else {
          timeDisplay = commentTime.toLocaleDateString();
        }
        return (
          <div key={index} className="flex w-full items-center border-b border-gray-300 p-2">
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
              <Link to={`/profile/${comment.nickname}`} className="font-normal">
                {comment.nickname}
              </Link>
              <div className="text-sm text-gray-500">{timeDisplay}</div>
              <div>{comment.text}</div>
              {/* <div className="text-xs text-gray-500">댓글 ID: {comment.id}</div> */}
            </div>
            <button
              className="mb-[24px] ml-auto p-2 text-gray-400"
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
      <div ref={commentsEndRef} />
    </div>
  );
};

export default BoardComments;
