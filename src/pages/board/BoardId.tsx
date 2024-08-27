import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ThunderImageModal from '../../components/thunder/ThunderImageModal';
import ContentLoader from 'react-content-loader';
import { BoardList } from '../../data/BoardList';
import { format, differenceInMinutes, differenceInHours } from 'date-fns';
import { ko } from 'date-fns/locale';
import { IoMdMore } from 'react-icons/io';
import ModalBottom from '../../components/common/ModalBottom';
import ModalCenter from '../../components/common/ModalCenter';
import BoardCommentModal from '../../components/board/BoardCommentModal';

interface BoardItem {
  id: number;
  category: string;
  title: string;
  description: string;
  hits: number;
  image_url: string[];
  created_at: string;
  comments: {
    id: number;
    author: string;
    content: string;
    created_at: string;
  }[];
}

const BoardId = () => {
  const [isThunderImageModalOpen, setIsThunderImageModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [selectedBoardItem, setSelectedBoardItem] = useState<BoardItem | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [comments, setComments] = useState<{ text: string; timestamp: Date }[]>([]);
  const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const [commentToEdit, setCommentToEdit] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState<string>('');

  useEffect(() => {
    const boardId = parseInt(window.location.pathname.split('/').pop() || '0', 10);
    const boardItem = BoardList.find((item) => item.id === boardId);
    setSelectedBoardItem(boardItem || null);
    if (boardItem) {
      setComments(
        boardItem.comments.map((comment) => ({
          text: comment.content,
          timestamp: new Date(comment.created_at),
        })),
      );
    }
  }, []);

  if (!selectedBoardItem) {
    return <div>게시물 정보를 불러올 수 없습니다.</div>;
  }

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const openThunderImageModal = () => {
    setSelectedImages(selectedBoardItem.image_url);
    setIsThunderImageModalOpen(true);
  };
  const closeThunderImageModal = () => setIsThunderImageModalOpen(false);

  const formatCreatedAt = (createdAt: string) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const minutesDifference = differenceInMinutes(now, createdDate);
    const hoursDifference = differenceInHours(now, createdDate);
    if (minutesDifference < 1) {
      return '방금 전';
    } else if (minutesDifference < 60) {
      return `${Math.floor(minutesDifference)}분 전`;
    } else if (hoursDifference < 24) {
      return `${Math.floor(hoursDifference)}시간 전`;
    } else {
      return format(createdDate, 'M월 d일', { locale: ko });
    }
  };

  const formattedCreatedAt = formatCreatedAt(selectedBoardItem.created_at);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      setComments((prevComments) => [...prevComments, { text: message, timestamp: new Date() }]);
      setMessage('');
    }
  };

  // ModalBottom open
  const toggleBottomModal = () => {
    setIsBottomModalOpen((prev) => !prev);
  };

  // ModalCenter Open
  const toggleCenterModal = () => {
    setIsCenterModalOpen((prev) => !prev);
  };

  // 댓글 수정 모달을 토글하는 함수
  // index가 null이 아닌 경우, 수정할 댓글의 인덱스를 설정하고 수정할 댓글의 텍스트를 설정
  const toggleEditModal = (index: number | null = null) => {
    setIsEditModalOpen((prev) => !prev);
    if (index !== null) {
      setCommentToEdit(index);
      setEditCommentText(comments[index].text);
    }
  };

  // 댓글을 삭제하는 함수
  // commentToDelete가 null이 아닌 경우, 해당 인덱스의 댓글을 삭제하고 모달을 닫음
  const handleDeleteComment = () => {
    if (commentToDelete !== null) {
      setComments((prevComments) => prevComments.filter((_, index) => index !== commentToDelete));
      setCommentToDelete(null);
      toggleCenterModal();
      toggleBottomModal(); // 댓글 삭제 후 BottomSheet 모달 닫기
    }
  };

  const handleEditComment = () => {
    if (commentToEdit !== null) {
      setComments((prevComments) =>
        prevComments.map((comment, index) =>
          index === commentToEdit ? { ...comment, text: editCommentText } : comment,
        ),
      );
      setCommentToEdit(null);
      setEditCommentText('');
      toggleEditModal();
      toggleBottomModal(); // 댓글 수정이 완료되면 BottomSheet modal 닫기
    }
  };

  return (
    <div className="relative mx-auto max-w-full rounded-lg bg-white p-4">
      <div className="mb-2 flex items-center">
        <div className="mr-2 rounded-lg border-2 border-[#ffe7e2] bg-[#FAF2F0] px-2 py-1 text-gray-800">
          {selectedBoardItem.category}
        </div>
      </div>

      <div className="mb-4 text-xl font-bold">{selectedBoardItem.title}</div>

      <div className="mb-4 flex items-center">
        <img src="../images/anonymous_avatars.svg" alt="프로필 사진" className="mr-2 h-10 w-10 rounded-full" />
        <div>
          <div className="flex items-center">
            <div className="text-sm font-medium">{selectedBoardItem.comments[0]?.author}</div>
            <div className="ml-2 text-xs font-medium text-gray-500">{formattedCreatedAt}</div>
          </div>
        </div>
      </div>

      <p className="mb-4 text-[#333333]">{selectedBoardItem.description}</p>

      {selectedBoardItem.image_url && !isImageLoaded && (
        <ContentLoader height={200} width={300} speed={2} backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
          <rect x="0" y="56" rx="3" ry="3" width="300" height="10" />
          <rect x="0" y="72" rx="3" ry="3" width="200" height="10" />
          <rect x="0" y="88" rx="3" ry="3" width="100" height="10" />
        </ContentLoader>
      )}
      {selectedBoardItem.image_url && (
        <img
          src={selectedBoardItem.image_url[0]}
          alt="게시물 이미지"
          className={`mb-4 mt-8 h-full w-full cursor-pointer rounded-lg object-cover ${isImageLoaded ? 'block' : 'hidden'}`}
          onLoad={() => setIsImageLoaded(true)}
          onClick={() => openThunderImageModal()}
        />
      )}
      <ThunderImageModal isOpen={isThunderImageModalOpen} onClose={closeThunderImageModal} images={selectedImages} />

      <div className="mb-4 mt-20 flex items-center">
        <p className="text-sm text-black">관심</p>
        <p className="ml-1 text-sm text-black">1</p>
        <p className="ml-2 text-sm text-black">조회수</p>
        <p className="ml-1 text-sm text-black">{selectedBoardItem.hits}</p>
      </div>
      <hr className="mb-5 mt-5 border-2 border-gray-200" />

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
              <img
                src="/images/anonymous_avatars.svg"
                alt="프로필 이미지"
                className="mb-[28px] mr-2 h-8 w-8 rounded-full"
              />
              <div>
                <div className="font-normal">별이엄마</div>
                <div className="text-sm text-gray-500">{timeDisplay}</div>
                <div>{comment.text}</div>
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
      </div>

      <div className="fixed bottom-0 z-50 flex w-full max-w-[600px] items-center justify-center bg-white p-4 xs:bottom-0 xs:w-[350px] xs:p-0 xs:pb-5">
        <motion.img
          src={isLiked ? '../images/SocialDiningLikeActive.svg' : '../images/SocialDiningLike.svg'}
          alt="좋아요"
          className="mr-2 cursor-pointer rounded-lg py-2 text-white"
          onClick={toggleLike}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          style={{ width: '40px', height: '40px' }}
        />
        <div className="flex flex-1 items-center rounded-md border border-gray-300">
          <input
            type="text"
            placeholder="메시지를 입력해주세요"
            className="flex-1 rounded-l-md px-3 py-2 xs:w-[150px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="mr-2 p-2" onClick={handleSendMessage}>
            <img src="/images/ThunderChatSend.svg" alt="Send" width={24} height={24} />
          </button>
        </div>
      </div>

      <ModalBottom isOpen={isBottomModalOpen} onClose={toggleBottomModal}>
        <div className="mx-auto h-[6px] w-[66px] rounded-[8px] bg-[#d9d9d9]" />
        <div className="flex flex-col gap-[20px] p-[20px]">
          <div className="text-[18px] font-bold" />
          <div className="flex flex-col items-center gap-[15px]">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              className="w-full rounded-xl px-4 py-4 font-bold text-black hover:bg-blue-500 hover:text-white"
              onClick={() => {
                toggleEditModal(commentToEdit);
                toggleBottomModal(); // 댓글 수정 modal이 open되면 ModalBottom 닫기
              }}>
              수정하기
            </motion.button>
            <div className="h-[1px] w-full bg-gray-200" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              className="w-full rounded-xl px-4 py-4 font-bold text-black hover:bg-yellow-800 hover:text-white"
              onClick={() => {
                setCommentToDelete(commentToEdit);
                toggleCenterModal();
              }}>
              삭제하기
            </motion.button>
          </div>
        </div>
      </ModalBottom>

      <ModalCenter
        isOpen={isCenterModalOpen}
        onClose={toggleCenterModal}
        title1={'댓글을 삭제하시겠습니까?'}
        title2={''}>
        <div className="p-2">
          <div className="mt-4 flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-[50px] w-full items-center justify-center rounded-xl border-2 border-orange-400 py-2 font-bold text-orange-500 hover:bg-orange-50"
              onClick={toggleCenterModal}>
              취소
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full rounded-xl bg-orange-500 px-2 py-3 font-semibold text-white hover:bg-orange-600"
              onClick={() => {
                handleDeleteComment();
                setIsBottomModalOpen(false); // 확인 버튼을 누르면 ModalBottom 닫히게
              }}>
              확인
            </motion.button>
          </div>
        </div>
      </ModalCenter>

      <BoardCommentModal
        isOpen={isEditModalOpen}
        onClose={toggleEditModal}
        title1={'댓글 수정'}
        title2={''}>
        <div className="px-0 py-0">
          <textarea
            className="w-full rounded-md border border-gray-300 p-2"
            value={editCommentText}
            onChange={(e) => setEditCommentText(e.target.value)}
            rows={2}
            style={{ resize: 'none', overflow: 'auto' }}
          />
          <div className="mt-4 flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 w-full rounded-xl bg-orange-500 px-2 py-3 font-semibold text-white hover:bg-orange-600"
              onClick={() => {
                handleEditComment();
                setIsEditModalOpen(false); // 수정하기 버튼을 누르면 EditModal Close
                setIsBottomModalOpen(false); // 수정하기 버튼을 누르면 ModalBottom Close
              }}>
              수정하기
            </motion.button>
          </div>
        </div>
      </BoardCommentModal>
    </div>
  );
};

export default BoardId;
