import { motion } from 'framer-motion';
import BoardIdComments from '../board/BoardIdComments';
import React from 'react';
import { isValid } from 'date-fns';

// BoardIdCommentSection 컴포넌트의 props 인터페이스 정의
interface BoardIdCommentSectionProps {
  comments: { id: number; is_host?: boolean; text?: string; timestamp?: string }[]; // 댓글 배열
  profileImageUrl: string; // 프로필 이미지 URL
  setCommentToEdit: (index: number | null) => void; // 편집할 댓글 설정
  setEditCommentText: (text: string) => void; // 편집할 댓글 텍스트 설정
  toggleBottomModal: () => void; // 하단 Modal 토글
  commentsEndRef: React.RefObject<HTMLDivElement>; // 댓글 끝 부분 참조
  message: string; // 현재 입력 메시지
  setMessage: (message: string) => void; // 메시지 설정 함수
  handleSendMessage: () => void; // 메시지 전송 처리
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void; // 키 입력 처리
  toggleLike: () => void; // 좋아요 토글 함수
}

// BoardIdCommentSection 컴포넌트 정의
const BoardIdCommentSection = ({
  comments,
  profileImageUrl,
  setCommentToEdit,
  setEditCommentText,
  toggleBottomModal,
  commentsEndRef,
  message,
  setMessage,
  handleSendMessage,
  handleKeyPress,
  toggleLike,
}: BoardIdCommentSectionProps) => (
  <div className="relative">
    {/* BoardIdComments 컴포넌트 렌더링 */}
    <BoardIdComments
      comments={comments.map((comment) => {
        const date = new Date(comment.timestamp ?? '');
        return {
          ...comment,
          is_host: comment.is_host ?? false,
          text: comment.text ?? '',
          timestamp: isValid(date) ? date : new Date('Invalid Date'),
        };
      })}
      profileImageUrl={profileImageUrl}
      setCommentToEdit={setCommentToEdit}
      setEditCommentText={setEditCommentText}
      toggleBottomModal={toggleBottomModal}
      commentsEndRef={commentsEndRef}
    />
    {/* 좋아요 버튼, 댓글 입력창 스타일 정의*/}
    <div className="flex w-full max-w-[1000px] items-center bg-white p-4">
      {/* 좋아요 버튼 */}
      <div className="mr-4 flex flex-col items-center">
        <motion.img
          src="/images/SocialDiningLike.svg"
          alt="좋아요"
          className="h-[30px] w-[30px] cursor-pointer"
          onClick={toggleLike}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
        />
      </div>
      {/* 댓글 입력창 */}
      <div className="flex flex-1 items-center rounded-md border border-gray-300">
        <input
          type="text"
          placeholder="메시지를 입력해주세요"
          className="flex-1 rounded-l-md px-3 py-2 xs:w-[150px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        {/* 전송 버튼 */}
        <button className="mr-2 p-2" onClick={handleSendMessage}>
          <img src="/images/ThunderChatSend.svg" alt="Send" width={24} height={24} />
        </button>
      </div>
    </div>
  </div>
);

export default BoardIdCommentSection;
