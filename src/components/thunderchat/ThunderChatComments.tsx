import { motion } from 'framer-motion';

// ThunderChatComments 컴포넌트의 props 인터페이스를 정의
interface ThunderChatCommentsProps {
  type: 'bottom' | 'center' | 'edit'; // 컴포넌트 타입 지정
  handleEditButtonClick?: () => void; // 수정 버튼 클릭 handler
  handleDeleteButtonClick?: () => void; // 삭제 버튼 클릭 handler
  errorMessage?: string | null; // error 메시지
  toggleCenterModal?: () => void; // 중앙 모달 토글
  handleDeleteComment?: () => void; // 댓글 삭제 handler
  editCommentText?: string; // 수정할 댓글 텍스트
  setEditCommentText?: (text: string) => void; // 수정할 댓글 텍스트 설정 함수
  handleEditComment?: () => void; // 댓글 수정 handler
}

// ThunderChatComments 컴포넌트 정의
const ThunderChatComments = ({
  type,
  handleEditButtonClick,
  handleDeleteButtonClick,
  errorMessage,
  toggleCenterModal,
  handleDeleteComment,
  editCommentText,
  setEditCommentText,
  handleEditComment,
}: ThunderChatCommentsProps) => {
  // 'bottom' 타입일 경우의 렌더링
  if (type === 'bottom') {
    return (
      <div>
        {/* 상단 회색 바 */}
        <div className="mx-auto h-[6px] w-[66px] rounded-[8px] bg-[#d9d9d9]" />
        <div className="flex flex-col gap-[20px] p-[20px]">
          <div className="text-[18px] font-bold" />
          <div className="flex flex-col items-center gap-[15px]">
            {/* 수정 버튼 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              className="w-full rounded-xl px-4 py-4 font-bold text-black hover:bg-blue-500 hover:text-white"
              onClick={handleEditButtonClick}>
              수정하기
            </motion.button>
            {/* 구분선 */}
            <div className="h-[1px] w-full bg-gray-200" />
            {/* 삭제 버튼 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              className="w-full rounded-xl px-4 py-4 font-bold text-black hover:bg-yellow-800 hover:text-white"
              onClick={handleDeleteButtonClick}>
              삭제하기
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'center') {
    return (
      <div className="p-2">
        <div className="mt-4 flex justify-center gap-4">
          {!errorMessage ? (
            <>
              {/* 취소 버튼 */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-[50px] w-full items-center justify-center rounded-xl border-2 border-orange-400 py-2 font-bold text-orange-500 hover:bg-orange-50"
                onClick={toggleCenterModal}>
                취소
              </motion.button>
              {/* 확인 버튼 */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full rounded-xl bg-orange-500 px-2 py-3 font-semibold text-white hover:bg-orange-600"
                onClick={handleDeleteComment}>
                확인
              </motion.button>
            </>
          ) : (
            // 에러 메시지가 있을 경우의 확인 버튼
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full rounded-xl bg-orange-500 px-2 py-3 font-semibold text-white hover:bg-orange-600"
              onClick={() => {
                if (toggleCenterModal) {
                  toggleCenterModal();
                }
                if (errorMessage) {
                  errorMessage = null;
                }
              }}>
              확인
            </motion.button>
          )}
        </div>
      </div>
    );
  }

  if (type === 'edit') {
    return (
      <div className="px-0 py-0">
        {/* 댓글 수정 텍스트 영역 */}
        <textarea
          className="w-full rounded-md border border-gray-300 p-2"
          value={editCommentText}
          onChange={(e) => {
            if (setEditCommentText) {
              setEditCommentText(e.target.value);
            }
          }}
          style={{ overflow: 'auto', resize: 'none' }}
          rows={2}
        />
        <div className="mt-7 flex justify-center gap-4">
          {/* 수정하기 버튼 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-[600px] rounded-xl bg-orange-500 px-2 py-3 font-semibold text-white hover:bg-orange-600"
            onClick={handleEditComment}>
            수정하기
          </motion.button>
        </div>
      </div>
    );
  }

  // 일치하는 타입이 없을 경우 null 반환
  return null;
};

export default ThunderChatComments;
