import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaTrash, FaEdit, FaComments, FaTimes } from 'react-icons/fa';

// ThunderIdFooter 컴포넌트의 props 인터페이스 정의
interface ThunderIdFooterProps {
  isLiked: boolean; // 좋아요 상태
  toggleLike: () => void; // 좋아요 토글 함수
  isHost: boolean; // 호스트 여부
  openDeleteModal: () => void; // 삭제 Modal 열기 함수
  isParticipating: boolean; // 참여 여부
  openCancelModal: () => void; // 취소 Modal 열기 함수
  handleParticipationClick: () => void; // 참여 클릭 handler
  meetingMembers: any[]; // 모임 member 배열
  selectedMeeting: {
    // 선택된 모임 정보
    uuid: string; // 모임 고유 UUID
    maximum: number; // 최대 참여 인원
  };
  handleEditMeeting: () => void; // 모임 수정 handler
}

// ThunderIdFooter 컴포넌트 정의
const ThunderIdFooter: React.FC<ThunderIdFooterProps> = ({
  isLiked,
  toggleLike,
  isHost,
  openDeleteModal,
  isParticipating,
  openCancelModal,
  handleParticipationClick,
  meetingMembers,
  selectedMeeting,
  handleEditMeeting,
}) => {
  return (
    <div className="flex flex-1 bg-white">
      {/* 좋아요 button */}
      <motion.div className="relative mt-1 cursor-pointer rounded-lg text-white" onClick={toggleLike}>
        <motion.img
          src={isLiked ? '../images/SocialDiningLikeActive.svg' : '../images/SocialDiningLike.svg'}
          alt="좋아요"
          className="h-10 w-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
        />
      </motion.div>
      {/* 좋아요 애니메이션 스타일 */}
      <style>
        {`
          @keyframes likeAnimation {
            0% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            100% {
              opacity: 0;
              transform: translateY(-50px) scale(1.5);
            }
          }
        `}
      </style>
      {isHost ? (
        <div className="flex items-center">
          {/* 소통방 링크 */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 1 }}>
            <Link
              to={`/thunder/thunderchat/${selectedMeeting.uuid}`}
              className="ml-2 flex h-[50px] w-[300px] items-center justify-center rounded-lg bg-orange-500 font-bold text-white hover:bg-orange-600 xs:w-[100px]">
              <FaComments className="mr-2" />
              소통방
            </Link>
          </motion.div>
          {/* 수정하기 button */}
          {/* is_host: true의 값을 backend쪽에서 반환하면 표시되는 button */}
          <motion.button
            onClick={handleEditMeeting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            className="ml-2 flex h-[50px] w-[300px] items-center justify-center rounded-lg border-2 border-blue-500 font-bold text-blue-500 hover:bg-blue-50 xs:w-[100px]">
            <FaEdit className="mr-2" />
            수정
          </motion.button>

          {/* 글 삭제 button */}
          {/* is_host: true의 값을 backend쪽에서 반환하면 표시되는 button */}
          <motion.button
            onClick={openDeleteModal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            className="ml-2 flex h-[50px] w-[300px] items-center justify-center rounded-lg border-2 border-orange-400 font-bold text-orange-500 hover:bg-orange-50 xs:w-[100px]">
            <FaTrash className="mr-2" />
            삭제
          </motion.button>
        </div>
      ) : isParticipating ? (
        // 참여 중인 경우 표시되는 버튼들
        <div className="flex items-center justify-between gap-2">
          {/* 참가 취소 button */}
          <motion.button
            onClick={openCancelModal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            className="ml-2 flex h-[50px] w-[180px] items-center justify-center rounded-lg border-2 border-orange-400 font-bold text-orange-500 hover:bg-orange-50 md:w-[450px] xs:w-[150px]">
            <FaTimes className="mr-2" />
            참가 취소
          </motion.button>

          {/* 소통방 링크 */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 1 }}>
            <Link
              to={`/thunder/thunderchat/${selectedMeeting.uuid}`}
              className="ml-2 flex h-[50px] w-[270px] items-center justify-center rounded-lg bg-orange-500 font-bold text-white hover:bg-orange-600 md:w-[450px] xs:w-[150px]">
              <FaComments className="mr-2" />
              소통방
            </Link>
          </motion.div>
        </div>
      ) : (
        // is_host: false의 값을 backend쪽에서 반환하면 표시되는 button
        <motion.button
          onClick={handleParticipationClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 1 }}
          className="ml-3 flex h-[50px] w-full items-center justify-center rounded-lg bg-orange-500 font-bold text-white hover:bg-orange-600">
          참여하기 ({meetingMembers.length}/{selectedMeeting.maximum})
        </motion.button>
      )}
    </div>
  );
};

export default ThunderIdFooter;
