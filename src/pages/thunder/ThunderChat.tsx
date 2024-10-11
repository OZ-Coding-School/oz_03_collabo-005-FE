import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { baseInstance, authInstance } from '../../api/util/instance';
import axios, { AxiosError } from 'axios';
import ThunderChatInfo from '../../components/thunderchat/ThunderChatInfo';
import ThunderChatSection from '../../components/thunderchat/ThunderChatSection';
import ThunderMessageInput from '../../components/thunderchat/ThunderMessageInput';
import ThunderChatComments from '../../components/thunderchat/ThunderChatComments';
import ModalBottom from '../../components/common/ModalBottom';
import ModalCenter from '../../components/common/ModalCenter';
import ThunderCommentModal from '../../components/thunder/ThunderCommentModal';

interface Meeting {
  id: string;
  title: string;
  date: string;
  payment_method_name?: string;
  age_group_name?: string;
  gender_group_name?: string;
  nickname?: string;
  meeting_image_url?: string;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  profile_image_url: string;
  nickname: string;
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

  const chatSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await baseInstance.get(`/api/meetings/${thunderId}`);
        setMeeting(response.data.meeting);

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

  const fetchComments = async () => {
    try {
      const response = await authInstance.get(`/api/meetings/member/comments/${thunderId}`);
      setComments(
        response.data.sort(
          (a: Comment, b: Comment) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        ),
      ); // 작성시간 기준 오름차순 정렬
    } catch (error) {
      // console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    if (thunderId) {
      fetchComments();
    }
  }, [thunderId]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchComments();
    }, 1000);

    return () => clearInterval(interval);
  }, [thunderId]);

  useEffect(() => {
    if (chatSectionRef.current) {
      chatSectionRef.current.scrollTo({
        top: chatSectionRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [comments]);

  // ESC 키를 누르면 모달을 닫는 함수
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditCommentModalOpen(false);
        setIsBottomModalOpen(false);
        setIsCenterModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
          setTimeout(() => {
            if (chatSectionRef.current) {
              chatSectionRef.current.scrollTo({
                top: chatSectionRef.current.scrollHeight,
                behavior: 'smooth',
              }); // 댓글이 추가된 후 스크롤을 맨 아래로 이동
            }
          }, 100);
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
          content: comments[editCommentIndex]?.content,
        });
        toggleEditCommentModal(editCommentIndex);
      } catch (error) {
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
        const response = await authInstance.post('/api/meetings/member/comment/delete/', {
          comment_id: comments[deleteCommentIndex]?.id, // 수정된 부분
        });
        if (response.status === 200) {
          setComments((prevComments) => prevComments.filter((_, index) => index !== deleteCommentIndex));
          console.log('댓글 삭제 성공');
        } else {
          console.error('댓글 삭제 실패:', response);
        }
        toggleCenterModal();
      } catch (error) {
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
          } else {
            console.error('댓글 삭제 중 오류가 발생했습니다:', axiosError);
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
        fetchComments(); // 수정 후 댓글 목록 갱신
        toggleEditCommentModal();
        setIsBottomModalOpen(false);
      } catch (error) {
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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="relative mx-auto max-w-full overflow-y-scroll rounded-xl border-2 bg-white p-4 shadow-xl md:max-w-[1000px] xs:mb-20 xs:w-[400px]">
      {meeting && <ThunderChatInfo meeting={meeting} profileImageUrl={profileImageUrl} />}

      <div ref={chatSectionRef}>
        <ThunderChatSection comments={comments} toggleBottomModal={toggleBottomModal} />
      </div>

      <ThunderMessageInput
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
        handleKeyPress={handleKeyPress}
      />

      <ModalBottom isOpen={isBottomModalOpen} onClose={() => setIsBottomModalOpen(false)}>
        <ThunderChatComments
          type="bottom"
          handleEditButtonClick={handleEditButtonClick}
          handleDeleteButtonClick={handleDeleteButtonClick}
        />
      </ModalBottom>

      <ModalCenter
        isOpen={isCenterModalOpen}
        onClose={() => {
          toggleCenterModal();
          setErrorMessage(null);
        }}
        title1={errorMessage || '댓글을 삭제하시겠습니까?'}
        title2={''}>
        <ThunderChatComments
          type="center"
          errorMessage={errorMessage}
          toggleCenterModal={toggleCenterModal}
          handleDeleteComment={handleDeleteComment}
        />
      </ModalCenter>

      <ThunderCommentModal
        isOpen={isEditCommentModalOpen}
        onClose={toggleEditCommentModal}
        title1={'댓글 수정'}
        title2={'내용'}>
        <ThunderChatComments
          type="edit"
          editCommentText={editCommentText}
          setEditCommentText={setEditCommentText}
          handleEditComment={handleEditComment}
        />
      </ThunderCommentModal>
    </div>
  );
};

export default ThunderChat;
