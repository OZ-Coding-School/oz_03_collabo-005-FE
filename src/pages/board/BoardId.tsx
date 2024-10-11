// 파일 상단에 Comment 인터페이스 추가
interface Comment {
  id: number;
  user_uuid: string;
  content: string;
  created_at?: string;
  nickname?: string;
  profile_image_url?: string;
}

import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import create from 'zustand';
import { baseInstance, authInstance } from '../../api/util/instance';
import ThunderImageModal from '../../components/thunder/ThunderImageModal';
import { NotFound } from '../notfound';
import Loading from '../../components/common/Loading';
import { getCookie } from '../../utils/cookie';
import BoardIdHeader from '../../components/board/BoardIdHeader';
import BoardIdContent from '../../components/board/BoardIdContent';
import BoardIdFooter from '../../components/board/BoardIdFooter';
import BoardIdCommentSection from '../../components/board/BoardIdCommentSection';
import ModalBottom from '../../components/common/ModalBottom';
import ModalCenter from '../../components/common/ModalCenter';
import BoardCommentModal from '../../components/board/BoardIdCommentModal';
import { IoHeart } from 'react-icons/io5';
import { AxiosError } from 'axios';

// Zustand 스토어 정의
interface BoardStore {
  selectedBoardItem: any | null;
  comments: Comment[];
  profileImageUrl: string;
  isLoading: boolean;
  isHost: boolean;
  setSelectedBoardItem: (item: any | null) => void;
  setComments: (comments: Comment[]) => void;
  setProfileImageUrl: (url: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsHost: (isHost: boolean) => void;
}

const useBoardStore = create<BoardStore>((set) => ({
  selectedBoardItem: null,
  comments: [],
  profileImageUrl: '',
  isLoading: true,
  isHost: false,
  setSelectedBoardItem: (item) => set({ selectedBoardItem: item }),
  setComments: (comments) => set({ comments }),
  setProfileImageUrl: (url) => set({ profileImageUrl: url }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsHost: (isHost) => set({ isHost }),
}));

const BoardId = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const {
    selectedBoardItem,
    comments,
    profileImageUrl,
    isLoading,
    isHost,
    setSelectedBoardItem,
    setComments,
    setIsHost,
    setProfileImageUrl,
    setIsLoading,
  } = useBoardStore();

  const [message, setMessage] = useState('');
  const [reviewImageUrl] = useState<string | null>(null);
  const [isThunderImageModalOpen, setIsThunderImageModalOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const [commentToEdit, setCommentToEdit] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState<string>('');
  const commentsEndRef = useRef<HTMLDivElement | null>(null);
  const [isUnauthorizedModalOpen, setIsUnauthorizedModalOpen] = useState(false);
  const [unauthorizedMessage, setUnauthorizedMessage] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 삭제 Modal 상태 추가
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false); // 삭제 확인 Modal 상태 추가
  const [confirmationMessage, setConfirmationMessage] = useState(''); // Modal 메시지 상태 추가

  const [isLikeModalOpen, setIsLikeModalOpen] = useState(false); // 좋아요 Modal 상태 추가
  const [isLiked, setIsLiked] = useState(false); // 좋아요 상태 추가

  const fetchBoardItem = async () => {
    const reviewId = window.location.pathname.split('/').pop();
    try {
      let reviewData;
      try {
        // 먼저 인증된 요청 시도
        const response = await authInstance.get(`/api/reviews/detail/${reviewId}/`);
        reviewData = response.data;
      } catch (authError) {
        // 인증 요청 실패 시 비인증 요청 시도
        const baseResponse = await baseInstance.get(`/api/reviews/detail/${reviewId}/`);
        reviewData = baseResponse.data;
      }

      const { review, comments } = reviewData;
      const is_host = review.is_host || false; // 비인증 요청의 경우 is_host가 없을 수 있으므로 기본값 설정

      setSelectedBoardItem(review);
      setIsHost(is_host);
      setProfileImageUrl(review.profile_image_url);

      const formattedComments = comments.map((comment: any) => ({
        id: comment.id,
        text: comment.content,
        timestamp: new Date(comment.created_at),
        nickname: comment.nickname,
        profile_image_url: comment.profile_image_url,
        user_uuid: comment.user_uuid,
      }));

      setComments(formattedComments.sort((a: any, b: any) => a.timestamp.getTime() - b.timestamp.getTime()));
      setIsLoading(false);
    } catch (error) {
      console.error('데이터 fetch 중 오류 발생:', error);
      setIsHost(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardItem(); // 항상 데이터를 가져오도록 수정
  }, [uuid]);

  const checkLoginAndExecute = (action: () => void) => {
    const token = getCookie('refresh');
    if (!token) {
      setIsLoginModalOpen(true);
    } else {
      action();
    }
  };

  const handleSendMessage = async () => {
    const isLoggedIn = !!getCookie('refresh');
    if (!isLoggedIn) {
      return { isUnauthorized: true, message: '댓글을 작성하시려면 로그인이 필요합니다.' };
    }
    if (message.trim() !== '') {
      const newComment = {
        content: message,
        uuid: selectedBoardItem?.uuid,
      };

      try {
        const response = await authInstance.post(`/api/comments/review/`, {
          uuid: newComment.uuid,
          content: newComment.content,
        });
        if (response.status === 201 && selectedBoardItem?.uuid) {
          await fetchBoardItem();
          setMessage('');
        }
      } catch (error) {
        console.error('댓글을 작성하는 중 오류가 발생했습니다:', error);
      }
    }
    return { isUnauthorized: false };
  };

  const handleCommentSubmit = () => {
    checkLoginAndExecute(handleSendMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommentSubmit();
    }
  };

  // 좋아요 클릭 핸들러
  const handleLikeClick = async () => {
    try {
      await authInstance.post(`/api/likes/`, { uuid: selectedBoardItem.uuid }); // 게시글의 UUID 전송
      setIsLiked(true); // 좋아요 상태 업데이트
      setIsLikeModalOpen(true); // 좋아요 Modal 열기
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.status === 400 &&
        error.response.data.detail === 'This is already liked post'
      ) {
        // 이미 좋아요가 눌려 있는 경우
        await handleUnlike(); // 좋아요 취소 함수 호출
      } else {
        console.error('좋아요를 누르는 중 오류가 발생했습니다:', error);
      }
    }
  };

  // 좋아요 취소 핸들러
  const handleUnlike = async () => {
    try {
      await authInstance.post(`/api/likes/delete/`, { uuid: selectedBoardItem.uuid }); // 게시글의 UUID 전송
      setIsLiked(false); // 좋아요 상태 업데이트
      setIsLikeModalOpen(true); // 좋아요 Modal 열기
    } catch (error) {
      console.error('좋아요 취소 중 오류가 발생했습니다:', error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!selectedBoardItem) {
    return <NotFound />;
  }

  const openThunderImageModal = () => {
    setSelectedImages([selectedBoardItem.review_image_url]);
    setIsThunderImageModalOpen(true);
  };
  const closeThunderImageModal = () => setIsThunderImageModalOpen(false);

  const toggleBottomModal = () => {
    setIsBottomModalOpen((prev) => !prev);
  };

  const toggleCenterModal = () => {
    setIsCenterModalOpen((prev) => !prev);
  };

  const toggleEditModal = (index: number | null = null, content: string = '') => {
    const userUuid = getCookie('user_uuid');
    if (index !== null && comments[index] && 'user_uuid' in comments[index] && comments[index].user_uuid !== userUuid) {
      setUnauthorizedMessage('댓글 작성자만 수정할 수 있습니다.');
      setIsUnauthorizedModalOpen(true);
      return;
    }
    setIsEditModalOpen((prev) => !prev);
    if (index !== null) {
      setCommentToEdit(index);
      setEditCommentText(content);
    }
  };

  const handleDeleteComment = async () => {
    if (commentToDelete !== null) {
      try {
        const response = await authInstance.post(`/api/comments/review/delete/`, {
          id: comments[commentToDelete].id,
        });
        if (response.status === 200) {
          const updatedComments = comments.filter((_, index) => index !== commentToDelete);
          setComments(updatedComments);
        }
      } catch (error: unknown) {
        if (error instanceof Error && 'response' in error && (error as any).response?.status === 400) {
          setUnauthorizedMessage('댓글작성자만 삭제 가능합니다');
          setIsUnauthorizedModalOpen(true);
        }
      }
    }
    setIsCenterModalOpen(false);
    setIsBottomModalOpen(false);
  };

  const handleEditComment = async () => {
    if (commentToEdit !== null) {
      try {
        const response = await authInstance.post(`/api/comments/review/update/`, {
          id: comments[commentToEdit].id,
          content: editCommentText,
        });
        if (response.status === 200) {
          const updatedComments = comments.map((comment, index) =>
            index === commentToEdit ? { ...comment, content: editCommentText } : comment,
          );
          setComments(updatedComments);
          setIsEditModalOpen(false);
          setIsBottomModalOpen(false);
        }
      } catch (error: unknown) {
        if (error instanceof Error && 'response' in error && (error as any).response?.status === 400) {
          setUnauthorizedMessage('댓글작성자만 수정 가능합니다');
          setIsUnauthorizedModalOpen(true);
        }
      }
    }
  };

  // 게시글 수정 핸들러
  const handleEditPost = () => {
    if (selectedBoardItem) {
      navigate(`/board/boardpostedit/${selectedBoardItem.uuid}`, {
        state: {
          review_uuid: selectedBoardItem.uuid,
          nickname: selectedBoardItem.nickname,
          category_name: selectedBoardItem.category_name,
          title: selectedBoardItem.title,
          content: selectedBoardItem.content,
          review_image_url: selectedBoardItem.review_image_url,
        },
      });
    }
  };

  // 게시글 삭제 핸들러
  const handleDeletePost = async () => {
    try {
      await authInstance.post(`/api/reviews/detail/delete/`, { review_uuid: selectedBoardItem.uuid }); // 현재 게시글의 UUID만 전달하여 API POST 요청
      setConfirmationMessage('게시글이 삭제되었습니다.'); // Modal 메시지 설정
      setIsConfirmationModalOpen(true); // 삭제 확인 Modal 열기
    } catch (error) {
      console.error('게시글 삭제 중 오류가 발생했습니다:', error);
    }
  };

  return (
    <motion.div
      className="relative mx-auto max-w-full overflow-y-scroll rounded-xl border-2 bg-white p-4 shadow-xl md:max-w-[1000px] xs:mb-20 xs:w-[400px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      <BoardIdHeader
        selectedBoardItem={selectedBoardItem}
        profileImageUrl={profileImageUrl}
        reviewImageUrl={reviewImageUrl}
      />
      <BoardIdContent
        selectedBoardItem={selectedBoardItem}
        isImageLoaded={isImageLoaded}
        setIsImageLoaded={setIsImageLoaded}
        openThunderImageModal={openThunderImageModal}
      />
      <BoardIdFooter
        selectedBoardItem={selectedBoardItem}
        isHost={isHost}
        onEdit={handleEditPost}
        onDelete={() => setIsDeleteModalOpen(true)} // 삭제 Modal 열기
        onLike={handleLikeClick} // 좋아요 클릭 핸들러 추가
      />
      <BoardIdCommentSection
        comments={comments}
        profileImageUrl={profileImageUrl}
        setCommentToEdit={setCommentToEdit}
        setEditCommentText={setEditCommentText}
        toggleBottomModal={toggleBottomModal}
        commentsEndRef={commentsEndRef}
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleCommentSubmit}
        handleKeyPress={handleKeyPress}
        toggleLike={() => checkLoginAndExecute(handleLikeClick)} // 수정된 부분
      />
      <ThunderImageModal isOpen={isThunderImageModalOpen} onClose={closeThunderImageModal} images={selectedImages} />
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
                toggleEditModal(commentToEdit, comments[commentToEdit!].content);
                toggleBottomModal();
              }}>
              수정하기
            </motion.button>
            <div className="h-[1px] w-full bg-gray-200" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              className="w-full rounded-xl px-4 py-4 font-bold text-black hover:bg-yellow-800 hover:text-white"
              onClick={() => {
                const userUuid = getCookie('user_uuid');
                if (commentToEdit !== null && comments[commentToEdit]?.user_uuid !== userUuid) {
                  setUnauthorizedMessage('댓글 작성자만 삭제할 수 있습니다.');
                  setIsUnauthorizedModalOpen(true);
                } else {
                  setCommentToDelete(commentToEdit);
                  toggleCenterModal();
                }
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
                setIsBottomModalOpen(false);
              }}>
              확인
            </motion.button>
          </div>
        </div>
      </ModalCenter>
      <ModalCenter
        isOpen={isUnauthorizedModalOpen}
        onClose={() => setIsUnauthorizedModalOpen(false)}
        title1={unauthorizedMessage}
        title2={''}>
        <div className="p-2">
          <div className="mt-4 flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full rounded-xl bg-orange-500 px-2 py-3 font-semibold text-white hover:bg-orange-600"
              onClick={() => {
                setIsUnauthorizedModalOpen(false);
              }}>
              확인
            </motion.button>
          </div>
        </div>
      </ModalCenter>
      <BoardCommentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          toggleEditModal();
        }}
        title1="댓글 수정"
        title2={''}>
        <div className="px-0 py-0">
          <textarea
            className="w-full rounded-md border border-gray-300 p-2"
            value={editCommentText}
            onChange={(e) => setEditCommentText(e.target.value)}
            rows={2}
            style={{ resize: 'none', overflow: 'auto' }}
            aria-label="댓글 수정"
            placeholder="댓글을 수정하세요"
          />
          <div className="mt-4 flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 w-full rounded-xl bg-orange-500 px-2 py-3 font-semibold text-white hover:bg-orange-600"
              onClick={handleEditComment}>
              수정하기
            </motion.button>
          </div>
        </div>
      </BoardCommentModal>
      {/* 로그인 모달 추가 */}
      <ModalBottom isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
        <div className="p-4 text-center">
          <p className="my-4 text-2xl font-semibold xs:text-xl">로그인이 필요한 서비스입니다.</p>
          <p className="mt-2 text-sm text-gray-600">이 기능을 사용하려면 먼저 로그인해주세요.</p>
          <button
            className="mt-4 w-full rounded-lg bg-primary px-10 py-3 font-bold text-white"
            onClick={() => {
              setIsLoginModalOpen(false);
              navigate('/signin');
            }}>
            로그인하기
          </button>
        </div>
      </ModalBottom>
      {/* 삭제 확인 Modal */}
      <ModalCenter
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title1={'정말로 이 게시글을 삭제할까요?'}
        title2={''}>
        <div className="p-2">
          <div className="mt-4 flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-[50px] w-full items-center justify-center rounded-xl border-2 border-orange-400 py-2 font-bold text-orange-500 hover:bg-orange-50"
              onClick={() => setIsDeleteModalOpen(false)}>
              취소
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full rounded-xl bg-orange-500 px-2 py-3 font-semibold text-white hover:bg-orange-600"
              onClick={() => {
                handleDeletePost(); // 삭제 요청
                setIsDeleteModalOpen(false); // Modal 닫기
              }}>
              확인
            </motion.button>
          </div>
        </div>
      </ModalCenter>
      {/* 삭제 완료 Modal */}
      <ModalCenter
        isOpen={isConfirmationModalOpen}
        onClose={() => {
          setIsConfirmationModalOpen(false);
          navigate('/board'); // Modal 닫고 /board 페이지로 이동
        }}
        title1={confirmationMessage}
        title2={''}>
        <div className="p-2">
          <div className="mt-4 flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full rounded-xl bg-orange-500 px-2 py-3 font-semibold text-white hover:bg-orange-600"
              onClick={() => {
                setIsConfirmationModalOpen(false);
                navigate('/board'); // Modal 닫고 /board 페이지로 이동
              }}>
              확인
            </motion.button>
          </div>
        </div>
      </ModalCenter>
      {/* 좋아요 완료 Modal */}
      <ModalBottom isOpen={isLikeModalOpen} onClose={() => setIsLikeModalOpen(false)}>
        <div className="p-4 text-center">
          <div className="mb-2 flex justify-center">
            {isLiked ? (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: -10, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 300, delay: 0.15 }} // 0.5초 지연 추가
                className="relative">
                <IoHeart className="text-[50px] text-pink-500" />
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.2 }}
                  transition={{ duration: 0.2, yoyo: Infinity }}
                  className="absolute inset-0 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-pink-500" />
                </motion.div>
              </motion.div>
            ) : (
              <IoHeart className="text-[50px] text-slate-500" /> // 좋아요가 취소되었을 때
            )}
          </div>
          <p className="my-4 text-lg font-semibold">
            {isLiked ? '게시글에 좋아요를 눌렀습니다.' : '좋아요가 취소되었습니다.'}
          </p>
          <button
            className="mt-4 w-full rounded-lg bg-primary px-10 py-3 font-bold text-white transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-orange-600 active:scale-95"
            onClick={() => setIsLikeModalOpen(false)}>
            확인
          </button>
        </div>
      </ModalBottom>
    </motion.div>
  );
};

export default BoardId;