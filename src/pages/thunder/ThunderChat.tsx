import { useState, useEffect } from 'react';
import { IoMdMore } from 'react-icons/io';
import ModalBottom from '../../components/common/ModalBottom';
import ModalCenter from '../../components/common/ModalCenter';
import ThunderCommentModal from '../../components/thunder/ThunderCommentModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { baseInstance, authInstance } from '../../api/util/instance';

interface Meeting {
  uuid: string;
  title: string;
  description: string;
  meeting_time: string;
  age_group_name: string;
  payment_method_name: string;
  gender_group_name: string;
  meeting_image_url: string;
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
  const [comments, setComments] = useState<Comment[]>([]);
  const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);
  const [isEditCommentModalOpen, setIsEditCommentModalOpen] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [editCommentIndex, setEditCommentIndex] = useState<number | undefined>(undefined);
  const [editCommentText, setEditCommentText] = useState<string>('');
  const [deleteCommentIndex, setDeleteCommentIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await baseInstance.get(`/api/meetings/${thunderId}`);
        setMeeting(response.data);
      } catch (error) {
        // console.error('Error fetching meeting:', error);
      }
    };

    fetchMeeting();
  }, [thunderId]);

  const fetchComments = async () => {
    try {
      const response = await authInstance.get(`/api/meetings/member/comments/${thunderId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
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

  const toggleBottomModal = () => {
    setIsBottomModalOpen((prev) => !prev);
  };

  const toggleCenterModal = () => {
    setIsCenterModalOpen((prev) => !prev);
  };

  const toggleEditCommentModal = (index?: number) => {
    if (index !== undefined) {
      setEditCommentIndex(index);
      setEditCommentText(comments[index].content);
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
        console.error('Error sending message:', error);
      }
    }
  };

  const handleEditComment = async () => {
    if (editCommentIndex !== undefined && editCommentText.trim() !== '') {
      try {
        await authInstance.post('/api/meetings/member/comment/update/', {
          comment_id: comments[editCommentIndex].id,
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
        console.error('Error updating comment:', error);
      }
    }
  };

  const handleDeleteComment = async () => {
    if (deleteCommentIndex !== null) {
      try {
        await authInstance.post('/api/meetings/member/comment/delete/', {
          comment_id: comments[deleteCommentIndex].id,
        });
        setComments((prevComments) => prevComments.filter((_, index) => index !== deleteCommentIndex));
        toggleCenterModal();
        setIsBottomModalOpen(false);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        await axios.get('/api/meetings/');
      } catch (error) {
        console.error('Error fetching meetings:', error);
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
      <h1 className="text-xl font-bold">{meeting?.title}</h1>
      <div className="fixed top-[72px] z-20 w-full max-w-[600px] bg-white pr-8" />
      {!meeting ? (
        <div className="mb-[72px] mt-[20px] flex w-full flex-col items-center justify-evenly bg-[#EEEEEE]">
          <p className="mt-10 text-[24px] text-[#666666] xs:text-[20px]">등록된 일정이 없어요</p>
          <img src="/images/CryingEgg.svg" className="inline-block h-[40vh]" alt="Crying Egg" />
          <p className="mb-4 flex items-center text-[20px] text-[#666666] xs:text-[16px]">
            <img src="/images/plusCircle.svg" className="mr-1 w-[2rem] xs:w-[1.5rem]" alt="Plus Circle" />
            버튼을 눌러 일정을 만들어보세요
          </p>
        </div>
      ) : null}

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
                  {/* <div className="text-xs text-gray-400">ID: {comment.id}</div> */}
                </div>
                <button
                  className="mb-[24px] ml-auto p-2 text-gray-400"
                  onClick={() => {
                    toggleBottomModal();
                    setEditCommentIndex(index);
                    setDeleteCommentIndex(index);
                  }}
                  title="더보기">
                  <IoMdMore size={28} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
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
              onClick={() => toggleEditCommentModal(editCommentIndex)}>
              수정하기
            </motion.button>
            <div className="h-[1px] w-full bg-gray-200" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              className="w-full rounded-xl px-4 py-4 font-bold text-black hover:bg-yellow-800 hover:text-white"
              onClick={toggleCenterModal}>
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
              onClick={handleDeleteComment}>
              확인
            </motion.button>
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
            onKeyDown={handleKeyPress} // 수정된 부분
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
