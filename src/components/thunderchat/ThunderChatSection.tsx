import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdMore } from 'react-icons/io';
import { formatCreatedAt } from '../../utils/formatCreatedAt';

// ThunderChatSection 컴포넌트의 props 타입 정의
interface ThunderChatSectionProps {
  comments: Comment[]; // 댓글 배열
  toggleBottomModal: (index: number) => void; // BottomModal 토글
}

// 댓글 객체의 타입 정의
interface Comment {
  created_at: string; // 댓글 생성 시간
  profile_image_url: string; // 프로필 이미지 URL
  nickname: string; // 사용자 닉네임
  content: string; // 댓글 내용
}

const ThunderChatSection = ({ comments, toggleBottomModal }: ThunderChatSectionProps) => {
  // 채팅 섹션에 대한 ref 생성
  const chatSectionRef = useRef<HTMLDivElement>(null);

  // 댓글이 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (chatSectionRef.current) {
      chatSectionRef.current.scrollTo({
        top: chatSectionRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [comments]);

  return (
    <div
      id="chat-section"
      ref={chatSectionRef}
      className="mb-[72px] mt-[10px] flex flex-col items-center overflow-y-scroll">
      {/* 댓글 수 표시 */}
      <div className="mb-[15px] w-full text-left text-sm text-black">댓글 {comments.length}</div>
      <AnimatePresence>
        {comments.map((comment, index) => {
          return (
            <motion.div
              key={index}
              className="flex w-full items-center border-b border-gray-300 p-2"
              initial={{ opacity: 0, y: -50 }} // 초기 상태 정의: 투명하고 위로 50px 이동
              animate={{ opacity: 1, y: 0 }} // 애니메이션 상태 정의: 불투명하고 원래 위치로
              exit={{ opacity: 0, y: -50 }} // 퇴장 상태 정의: 다시 투명해지고 위로 50px 이동
              transition={{ duration: 0.3 }} // 애니메이션 지속 시간 정의
            >
              {/* 프로필 이미지 */}
              <img
                src={comment.profile_image_url || '/images/anonymous_avatars.svg'}
                alt="프로필 이미지"
                className="mb-[28px] mr-2 h-8 w-8 rounded-full"
              />
              <div>
                {/* 사용자 닉네임 */}
                <div className="font-normal">{comment.nickname}</div>
                {/* 댓글 작성 시간 */}
                <div className="text-sm text-gray-500">{formatCreatedAt(comment.created_at)}</div>
                {/* 댓글 내용 */}
                <div>{comment.content}</div>
              </div>
              {/* 더보기 버튼 */}
              <button
                className="mb-[24px] ml-auto p-2 text-gray-400"
                onClick={() => toggleBottomModal(index)}
                title="더보기">
                <IoMdMore size={28} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ThunderChatSection;
