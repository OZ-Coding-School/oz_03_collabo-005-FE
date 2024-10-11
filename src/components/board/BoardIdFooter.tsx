import React from 'react';

// icons 컴포넌트 가져오기
import { AiOutlineHeart, AiOutlineEye } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { FaTrash, FaEdit } from 'react-icons/fa';

// BoardItem 인터페이스 정의
interface BoardItem {
  id: number;
  title: string;
  likes_count: number;
  hits: number;
}

// BoardIdFooter 컴포넌트의 props 인터페이스 정의
interface BoardIdFooterProps {
  selectedBoardItem: BoardItem; // 선택된 게시물 항목을 나타내는 속성
  isHost: boolean; // 현재 사용자가 호스트인지 확인
  onEdit: () => void; // 수정 버튼 클릭 시 실행
  onDelete: () => void; // 삭제 버튼 클릭 시 실행
  onLike: () => Promise<void>; // 좋아요 버튼 클릭 시 실행
}

// BoardIdFooter 컴포넌트 정의
const BoardIdFooter: React.FC<BoardIdFooterProps> = ({ selectedBoardItem, isHost, onEdit, onDelete }) => {
  return (
    <div>
      <div className="mb-4 mt-20 flex flex-col items-start">
        {/* 관심 수, 조회수 표시 */}
        <div className="flex items-center">
          <AiOutlineHeart className="mr-1 text-sm text-black" />
          <p className="text-sm text-black">관심</p>
          <p className="ml-1 text-sm text-black">{selectedBoardItem.likes_count}</p>
          <AiOutlineEye className="ml-2 mr-1 text-sm text-black" />
          <p className="text-sm text-black">조회수</p>
          <p className="ml-1 text-sm text-black">{selectedBoardItem.hits}</p>
        </div>

        {/* 호스트인 경우에만 수정 및 삭제 버튼 표시 */}
        {isHost && (
          <div className="mt-10 flex w-full items-center justify-center gap-2 xs:gap-0">
            {/* 수정하기 버튼 */}
            <motion.button
              onClick={onEdit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              className="ml-2 flex h-[50px] w-[500px] items-center justify-center rounded-lg border-2 border-blue-500 font-bold text-blue-500 hover:bg-blue-50 xs:ml-0 xs:w-[200px]">
              <FaEdit className="mr-2" />
              수정
            </motion.button>
            {/* 삭제하기 버튼 */}
            <motion.button
              onClick={onDelete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              className="ml-2 flex h-[50px] w-[500px] items-center justify-center rounded-lg border-2 border-orange-400 font-bold text-orange-500 hover:bg-orange-50 xs:w-[200px]">
              <FaTrash className="mr-2" />
              삭제
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardIdFooter;
