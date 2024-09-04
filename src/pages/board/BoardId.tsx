import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThunderImageModal from '../../components/thunder/ThunderImageModal';
import ContentLoader from 'react-content-loader';
import { authInstance } from '../../api/util/instance';
import { format, differenceInMinutes, differenceInHours } from 'date-fns';
import { ko } from 'date-fns/locale';
import { IoMdMore } from 'react-icons/io';
import ModalBottom from '../../components/common/ModalBottom';
import ModalCenter from '../../components/common/ModalCenter';
import BoardCommentModal from '../../components/board/BoardCommentModal';
import { NotFound } from '../notfound';
import Loading from '../../components/common/Loading';

interface BoardItem {
  uuid: string;
  category: number;
  title: string;
  content: string;
  review_image_url: string;
  hits: number;
  comment_count: number;
  likes_count: number;
  created_at: string;
  nickname: string;
  comments: {
    nickname: string;
    profile_image_url: string;
    created_at: string;
    content: string;
  }[];
}

const BoardId = () => {
  const [isThunderImageModalOpen, setIsThunderImageModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [selectedBoardItem, setSelectedBoardItem] = useState<BoardItem | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [comments, setComments] = useState<
    { text: string; timestamp: Date; nickname?: string; profile_image_url?: string }[]
  >([]);
  const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const [commentToEdit, setCommentToEdit] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBoardItem = async () => {
      const boardId = window.location.pathname.split('/').pop();
      try {
        const response = await authInstance.get(`/api/reviews/detail/${boardId}`);
        const boardItem = response.data.review;
        setSelectedBoardItem(boardItem);
        setComments(
          boardItem.comments.map(
            (comment: { content: string; created_at: string; nickname: string; profile_image_url: string }) => ({
              text: comment.content,
              timestamp: new Date(comment.created_at),
              nickname: comment.nickname,
              profile_image_url: comment.profile_image_url,
            }),
          ),
        );
        setIsLoading(false);
      } catch (error) {
        console.error('게시물 정보를 불러오는 중 오류가 발생했습니다:', error);
        setIsLoading(false);
      }
    };

    fetchBoardItem();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (!selectedBoardItem) {
    return <NotFound />;
  }

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const openThunderImageModal = () => {
    setSelectedImages([selectedBoardItem.review_image_url]);
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

  const handleSendMessage = async () => {
    if (message.trim() !== '') {
      const newComment = {
        comments: message,
        uuid: selectedBoardItem.uuid,
      };

      try {
        // 댓글을 작성하기 위해 API 요청을 보냄
        const response = await authInstance.post(`/api/reviews/detail/${selectedBoardItem.uuid}/comments`, {
          uuid: newComment.uuid,
          comments: newComment.comments,
        });
        if (response.status === 200) {
          setComments((prevComments) => [
            ...prevComments,
            {
              text: newComment.comments,
              timestamp: new Date(),
            },
          ]);
          setMessage('');
        }
      } catch (error) {
        console.error('댓글을 작성하는 중 오류가 발생했습니다:', error);
      }
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
          {selectedBoardItem.category === 1 ? '맛집 추천' : '소셜 다이닝 후기'}
        </div>
      </div>

      <div className="mb-4 text-xl font-bold">{selectedBoardItem.title}</div>

      <div className="mb-4 flex items-center">
        <Link to={`/profile/${selectedBoardItem.nickname}`}>
          <img
            src={selectedBoardItem.comments[0]?.profile_image_url || '../images/anonymous_avatars.svg'}
            alt="프로필 사진"
            className="mr-2 h-10 w-10 rounded-full"
            onError={(e) => {
              e.currentTarget.src = '../images/anonymous_avatars.svg';
            }}
          />
        </Link>

        <div>
          <div className="flex items-center">
            <Link to={`/profile/${selectedBoardItem.nickname}`} className="text-sm font-medium">
              {selectedBoardItem.nickname}
            </Link>
            <div className="ml-2 text-xs font-medium text-gray-500">{formattedCreatedAt}</div>
          </div>
        </div>
      </div>

      <p className="mb-4 text-[#333333]">{selectedBoardItem.content}</p>

      {selectedBoardItem.review_image_url && !isImageLoaded && (
        <ContentLoader height={200} width={300} speed={2} backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
          <rect x="0" y="56" rx="3" ry="3" width="300" height="10" />
          <rect x="0" y="72" rx="3" ry="3" width="200" height="10" />
          <rect x="0" y="88" rx="3" ry="3" width="100" height="10" />
        </ContentLoader>
      )}
      {selectedBoardItem.review_image_url && (
        <img
          src={selectedBoardItem.review_image_url}
          alt="게시물 이미지"
          className={`mb-4 mt-8 h-full w-full cursor-pointer rounded-lg object-cover ${isImageLoaded ? 'block' : 'hidden'}`}
          onLoad={() => setIsImageLoaded(true)}
          onClick={() => openThunderImageModal()}
        />
      )}
      <ThunderImageModal isOpen={isThunderImageModalOpen} onClose={closeThunderImageModal} images={selectedImages} />

      <div className="mb-4 mt-20 flex items-center">
        <p className="text-sm text-black">관심</p>
        <p className="ml-1 text-sm text-black">{selectedBoardItem.likes_count}</p>
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
                src={comment.profile_image_url}
                alt="프로필 이미지"
                className="mb-[28px] mr-2 h-8 w-8 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = '/images/anonymous_avatars.svg';
                }}
              />
              <div>
                <div className="font-normal">{comment.nickname}</div>
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

      <div className="fixed bottom-0 left-1/2 z-50 flex w-full max-w-[600px] -translate-x-1/2 items-center justify-center bg-white py-4 pr-4 xs:py-2 xs:pr-0">
        <motion.img
          src={isLiked ? '../images/SocialDiningLikeActive.svg' : '../images/SocialDiningLike.svg'}
          alt="좋아요"
          className="h-[40px] w-[40px] cursor-pointer rounded-lg py-2 text-white"
          onClick={toggleLike}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
        />
        <div className="mr-2 flex grow items-center rounded-md border border-gray-300">
          <input
            type="text"
            placeholder="메시지를 입력해주세요"
            className="grow rounded-l-md py-2 pl-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="p-2" onClick={handleSendMessage}>
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

      <BoardCommentModal isOpen={isEditModalOpen} onClose={toggleEditModal} title1={'댓글 수정'} title2={''}>
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
