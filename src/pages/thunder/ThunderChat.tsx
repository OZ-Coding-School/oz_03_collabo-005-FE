import { useState, useEffect } from 'react';
import { IoMdMore } from 'react-icons/io';
import ModalBottom from '../../components/common/ModalBottom';
import ModalCenter from '../../components/common/ModalCenter';
import ThunderCommentModal from '../../components/thunder/ThunderCommentModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { format, differenceInMinutes, differenceInHours } from 'date-fns';
import { ko } from 'date-fns/locale';
import { baseInstance, authInstance } from '../../api/util/instance';
import axios, { AxiosError } from 'axios';

interface Meeting {
  uuid: string;
  title: string;
  payment_method_name: string;
  age_group_name: string;
  gender_group_name: string;
  meeting_time: string;
  meeting_image_url: string;
  description: string;
  created_at: string;
  nickname: string;
  profile_image_url?: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profile_image_url?: string;
  nickname?: string;
}

const ThunderChat = () => {
  const { thunderId } = useParams();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);
  const [isEditCommentModalOpen, setIsEditCommentModalOpen] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [editCommentIndex, setEditCommentIndex] = useState<number | undefined>(undefined);
  const [editCommentText, setEditCommentText] = useState<string>('');
  const [deleteCommentIndex, setDeleteCommentIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await baseInstance.get(`/api/meetings/${thunderId}`);
        setMeeting(response.data.meeting);

        // 작성자 프로필 이미지 가져오기
        if (response.data.meeting.nickname) {
          const profileResponse = await baseInstance.get(`/api/profile/${response.data.meeting.nickname}/`);
          setProfileImageUrl(profileResponse.data.profile_image_url);
        }
      } catch (error) {
        // console.error('Error fetching meeting:', error);
      }
    };

    fetchMeeting();
  }, [thunderId]);

  // 작성 시간 포맷팅 함수
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

  const fetchComments = async () => {
    try {
      const response = await authInstance.get(`/api/meetings/member/comments/${thunderId}`);
      setComments(response.data);
    } catch (error) {
      // console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    if (thunderId) {
      fetchComments();
    }
  }, [thunderId]);

  // 실시간 댓글 업데이트를 위한 폴링
  useEffect(() => {
    const interval = setInterval(() => {
      fetchComments();
    }, 1000); // 1초마다 댓글 갱신

    return () => clearInterval(interval);
  }, [thunderId]);

  const toggleBottomModal = (index: number) => {
    setEditCommentIndex(index);
    setDeleteCommentIndex(index);
    setIsBottomModalOpen((prev) => !prev);
  };

  const toggleCenterModal = () => {
    setIsCenterModalOpen((prev) => !prev);
  };

  const toggleEditCommentModal = (index?: number) => {
    if (index !== undefined) {
      setEditCommentIndex(index);
      setEditCommentText(comments[index]?.content || '');
    }
    setIsEditCommentModalOpen((prev) => !prev);
  };

  const handleSendMessage = async () => {
    if (message.trim() !== '') {
      try {
        const response = await authInstance.post('/api/meetings/member/comment/create/', {
          content: message,
          meeting_uuid: thunderId,
        });
        if (response.status === 201) {
          fetchComments();
        }
        setMessage('');
      } catch (error) {
        // console.error('Error sending message:', error);
      }
    }
  };

  const handleEditButtonClick = async () => {
    if (editCommentIndex !== undefined) {
      try {
        await authInstance.post('/api/meetings/member/comment/update/', {
          comment_id: comments[editCommentIndex]?.id,
          content: comments[editCommentIndex]?.content, // 내용을 변경하지 않고 그대로 전송
        });
        toggleEditCommentModal(editCommentIndex);
      } catch (error) {
        // console.error('댓글 수정 권한 확인 오류:', error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (
            axiosError.response &&
            axiosError.response.status === 400 &&
            Array.isArray(axiosError.response.data) &&
            axiosError.response.data[0] === "It's not your Comment"
          ) {
            setErrorMessage('댓글 작성자가 아니므로 수정할 수 없습니다');
            toggleCenterModal();
          }
        }
      }
      setIsBottomModalOpen(false);
    }
  };

  const handleDeleteButtonClick = () => {
    toggleCenterModal();
    setIsBottomModalOpen(false);
  };

  const handleDeleteComment = async () => {
    if (deleteCommentIndex !== null) {
      try {
        await authInstance.post('/api/meetings/member/comment/delete/', {
          comment_id: comments[deleteCommentIndex]?.id,
        });
        setComments((prevComments) => prevComments.filter((_, index) => index !== deleteCommentIndex));
        toggleCenterModal();
      } catch (error) {
        // console.error('댓글 삭제 오류:', error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (
            axiosError.response &&
            axiosError.response.status === 400 &&
            Array.isArray(axiosError.response.data) &&
            axiosError.response.data[0] === "It's not your Comment"
          ) {
            setErrorMessage('댓글 작성자만 댓글을 삭제할 수 있습니다');
            toggleCenterModal();
          }
        }
      }
    }
  };

  const handleEditComment = async () => {
    if (editCommentIndex !== undefined && editCommentText.trim() !== '') {
      try {
        await authInstance.post('/api/meetings/member/comment/update/', {
          comment_id: comments[editCommentIndex]?.id,
          content: editCommentText,
        });
        setComments((prevComments) =>
          prevComments.map((comment, index) =>
            index === editCommentIndex ? { ...comment, content: editCommentText } : comment,
          ),
        );
        toggleEditCommentModal();
        setIsBottomModalOpen(false);
      } catch (error) {
        // console.error('댓글 수정 오류:', error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (
            axiosError.response &&
            axiosError.response.status === 400 &&
            Array.isArray(axiosError.response.data) &&
            axiosError.response.data[0] === "It's not your Comment"
          ) {
            setErrorMessage('댓글 작성자만 댓글을 수정할 수 있습니다');
            toggleEditCommentModal();
            toggleCenterModal();
          }
        }
      }
    }
  };

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        await authInstance.get('/api/meetings/');
      } catch (error) {
        // console.error('Error fetching meetings:', error);
      }
    };

    fetchMeetings();
  }, []);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="relative w-full max-w-[600px] p-4 pt-0">
      {meeting && (
        <>
          <h1 className="mb-4 text-xl font-bold">{meeting.title}</h1>

          {/* 모임 정보 */}
          <div className="mb-4 flex items-center text-sm text-gray-500">
            <div className="mr-2 rounded-md border-2 border-gray-200 bg-slate-100 px-2 py-1 text-black">
              {meeting.payment_method_name}
            </div>
            <div className="mr-2 rounded-md border-2 border-gray-200 bg-slate-100 px-2 py-1 text-black">
              {meeting.age_group_name}
            </div>
            <div className="mr-2 rounded-md border-2 border-gray-200 bg-slate-100 px-2 py-1 text-black">
              {meeting.gender_group_name}
            </div>
          </div>

          {/* 작성자 정보 */}
          <div className="mb-4 flex items-center">
            <Link to={`/profile/${meeting.nickname}`}>
              <img
                src={profileImageUrl || meeting.profile_image_url || '../images/anonymous_avatars.svg'}
                alt="프로필 사진"
                className="mr-2 h-10 w-10 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).onerror = null;
                  (e.target as HTMLImageElement).src = '../images/anonymous_avatars.svg';
                }}
              />
            </Link>
            <div>
              <div className="flex items-center">
                <Link to={`/profile/${meeting.nickname}`} className="text-sm font-medium">
                  {meeting.nickname}
                </Link>
                <div className="ml-2 text-xs font-medium text-gray-500">{formatCreatedAt(meeting.created_at)}</div>
              </div>
            </div>
          </div>

          {/* 모임 일정 */}
          <div className="mb-4 flex h-full w-full items-center rounded-[11.5px] border-2 border-[#ffe7e2] text-sm text-gray-500">
            <img src="/images/ThunderCalender.svg" alt="캘린더" className="mr-[10px] h-[70px] w-[70px]" />
            <p className="ml-2 text-[14px] text-[#333333]">{new Date(meeting.meeting_time).toLocaleString()}</p>
          </div>

          {/* 모임 설명 */}
          <p className="mb-4 text-[#333333]">{meeting.description}</p>

          {/* 모임 이미지 */}
          {meeting.meeting_image_url && (
            <img
              src={meeting.meeting_image_url}
              alt="소셜다이닝 게시판 이미지"
              className="mb-4 mt-8 h-full w-full cursor-pointer rounded-lg object-cover"
            />
          )}
        </>
      )}

      <div className="mb-[72px] mt-[10px] flex flex-col items-center overflow-auto">
        <div className="mb-[15px] w-full text-left text-sm text-black">댓글 {comments.length}</div>
        <AnimatePresence>
          {comments.map((comment, index) => {
            const now = new Date();
            const commentTime = new Date(comment.created_at);
            const minutesDifference = Math.floor((now.getTime() - commentTime.getTime()) / 1000 / 60);

            const timeDisplay =
              minutesDifference < 1
                ? '방금 전'
                : minutesDifference < 60
                  ? `${minutesDifference}분 전`
                  : minutesDifference < 1440
                    ? `${Math.floor(minutesDifference / 60)}시간 전`
                    : commentTime.toLocaleDateString();

            return (
              <motion.div
                key={index}
                className="flex w-full items-center border-b border-gray-300 p-2"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}>
                <img
                  src={comment.profile_image_url || '/images/anonymous_avatars.svg'}
                  alt="프로필 이미지"
                  className="mb-[28px] mr-2 h-8 w-8 rounded-full"
                />
                <div>
                  <div className="font-normal">{comment.nickname}</div>
                  <div className="text-sm text-gray-500">{timeDisplay}</div>
                  <div>{comment.content}</div>
                  {/* 개발환경 - comment.id 테스트 */}
                  {/* <div className="text-xs text-gray-400">ID: {comment.id}</div> */}
                </div>
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

      <ModalBottom isOpen={isBottomModalOpen} onClose={() => setIsBottomModalOpen(false)}>
        <div className="mx-auto h-[6px] w-[66px] rounded-[8px] bg-[#d9d9d9]" />
        <div className="flex flex-col gap-[20px] p-[20px]">
          <div className="text-[18px] font-bold" />
          <div className="flex flex-col items-center gap-[15px]">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              className="w-full rounded-xl px-4 py-4 font-bold text-black hover:bg-blue-500 hover:text-white"
              onClick={handleEditButtonClick}>
              수정하기
            </motion.button>
            <div className="h-[1px] w-full bg-gray-200" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              className="w-full rounded-xl px-4 py-4 font-bold text-black hover:bg-yellow-800 hover:text-white"
              onClick={handleDeleteButtonClick}>
              삭제하기
            </motion.button>
          </div>
        </div>
      </ModalBottom>

      <ModalCenter
        isOpen={isCenterModalOpen}
        onClose={() => {
          toggleCenterModal();
          setErrorMessage(null);
        }}
        title1={errorMessage || '댓글을 삭제하시겠습니까?'}
        title2={''}>
        <div className="p-2">
          <div className="mt-4 flex justify-center gap-4">
            {!errorMessage ? (
              <>
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
                  onClick={handleDeleteComment}>
                  확인
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full rounded-xl bg-orange-500 px-2 py-3 font-semibold text-white hover:bg-orange-600"
                onClick={() => {
                  toggleCenterModal();
                  setErrorMessage(null);
                }}>
                확인
              </motion.button>
            )}
          </div>
        </div>
      </ModalCenter>

      <ThunderCommentModal
        isOpen={isEditCommentModalOpen}
        onClose={toggleEditCommentModal}
        title1={'댓글 수정'}
        title2={'내용'}>
        <div className="px-0 py-0">
          <textarea
            className="w-full rounded-md border border-gray-300 p-2"
            value={editCommentText}
            onChange={(e) => setEditCommentText(e.target.value)}
            style={{ overflow: 'auto', resize: 'none' }}
            rows={2}
          />
          <div className="mt-7 flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-[600px] rounded-xl bg-orange-500 px-2 py-3 font-semibold text-white hover:bg-orange-600"
              onClick={handleEditComment}>
              수정하기
            </motion.button>
          </div>
        </div>
      </ThunderCommentModal>

      <div className="fixed bottom-0 z-50 flex w-full max-w-[600px] items-center bg-white p-4 xs:bottom-0 xs:w-[350px] xs:p-0 xs:pb-5 xs:pt-2">
        <div className="flex flex-1 items-center rounded-md border border-gray-300">
          <input
            type="text"
            placeholder="메시지를 입력해주세요"
            className="flex-1 rounded-l-md px-3 py-2 xs:w-[150px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button className="mr-2 p-2" onClick={handleSendMessage}>
            <img src="/images/ThunderChatSend.svg" alt="Send" width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThunderChat;
