import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ModalCenter from '../../components/common/ModalCenter';
import ThunderImageModal from '../../components/thunder/ThunderImageModal';
import { NotFound } from '../notfound';
import Loading from '../../components/common/Loading';
import { authInstance, baseInstance } from '../../api/util/instance';
import ThunderIdHeader from '../../components/thunder/ThunderIdHeader';
import ThunderIdContent from '../../components/thunder/ThunderIdContent';
import ThunderIdComments from '../../components/thunder/ThunderIdComments';
import ThunderIdFooter from '../../components/thunder/ThunderIdFooter';
import { useNavigate } from 'react-router-dom';
import ModalBottom from '../../components/common/ModalBottom';
import { getCookie } from '../../utils/cookie'; // getCookie 함수 추가
import { IoHeart } from 'react-icons/io5';

// ThunderId - 소셜다이닝 글 목록 조회
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
  is_liked: boolean;
  maximum: number;
  location_name: string;
}

interface MeetingMember {
  id: number;
  profile_image_url: string;
  introduction: string;
  nickname: string;
  created_at: string;
  is_host: boolean;
  is_participating: boolean;
  is_liked: boolean;
  is_full: boolean;
  is_deleted: boolean;
}

const ThunderId = () => {
  const navigate = useNavigate();
  const [isModalCenterOpen, setIsModalCenterOpen] = useState(false); // ModalCenter의 Open/Close 상태를 관리
  const [isThunderImageModalOpen, setIsThunderImageModalOpen] = useState(false); // ImageModal Open/Close 상태 관리
  const [isLiked, setIsLiked] = useState(false); // 좋아요 상태를 관리하는 상태
  const [isParticipating, setIsParticipating] = useState(false); // 참여 상태를 관리
  const [isParticipatingCancelModalOpen, setIsParticipatingCancelModalOpen] = useState(false); // 참여 취소 모달의 열림/닫힘 상태를 관리
  const [isImageLoaded, setIsImageLoaded] = useState(false); // 이미지 로드 상태를 관리
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null); // 선택된 모임 정보를 관리
  const [selectedImages, setSelectedImages] = useState<string[]>([]); // 선택된 이미지 URL들을 관리
  const [meetingMembers, setMeetingMembers] = useState<MeetingMember[]>([]); // 모임 멤버 정보를 관리
  const [isLoading, setIsLoading] = useState(true);
  const [profileImageUrl, setProfileImageUrl] = useState<string>(''); // 작성자 프로필 이미지 URL을 관리
  const [isHost, setIsHost] = useState(false); // 호스트 상태를 관리
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 삭제 모달 상태 관리
  const [isFullModalOpen, setIsFullModalOpen] = useState(false); // 정원 초과 모달 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLikeModalOpen, setIsLikeModalOpen] = useState(false); // 좋아요 Modal 상태 추가

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const meetingId = window.location.pathname.split('/').pop();
        const response = await baseInstance.get(`/api/meetings/${meetingId}`);
        setSelectedMeeting(response.data.meeting);
        setMeetingMembers(response.data.meeting_member);
        setIsLoading(false);

        // 좋아요 상태 확인
        const likeResponse = await authInstance.get(`/api/meetings/${meetingId}`);
        setIsLiked(likeResponse.data.is_liked); // is_liked 상태 설정
        setIsHost(likeResponse.data.is_host); // 호스트 상태 설정

        // 참여 상태 확인
        const participationResponse = await authInstance.get(`/api/meetings/member/check/${meetingId}`);
        setIsParticipating(participationResponse.data.result); // 참여 상태 설정
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchMeeting();
  }, []); // 빈 배열을 추가하여 무한 루프 방지

  useEffect(() => {
    if (selectedMeeting) {
      baseInstance.get(`/api/profile/${selectedMeeting.nickname}/`).then((res) => {
        setProfileImageUrl(res.data.profile_image_url);
      });
    }
  }, [selectedMeeting]);

  useEffect(() => {
    // 로그인 상태 확인
    const refreshToken = getCookie('refresh'); // 쿠키에서 refreshToken 가져오기
    setIsLoggedIn(!!refreshToken);
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // 댓글 최신순 정렬
  useEffect(() => {
    setMeetingMembers((prevMembers) =>
      [...prevMembers].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    );
  }, [selectedMeeting]); // selectedMeeting이 변경될 때만 실행

  if (isLoading) {
    return <Loading />;
  }

  if (!selectedMeeting) {
    return <NotFound />;
  }

  // 로그인 상태 확인 및 모달 표시 함수
  const checkLoginAndProceed = (action: () => void) => {
    if (!isLoggedIn) {
      // 비로그인 상태일 경우
      setIsLoginModalOpen(true); // 로그인 안내 모달 열기
    } else {
      action(); // 로그인 상태일 경우 주어진 액션 실행
    }
  };

  // 참여 handler
  const handleConfirmParticipation = () => {
    checkLoginAndProceed(async () => {
      try {
        const meetingId = window.location.pathname.split('/').pop();
        await authInstance.post('/api/meetings/member/', { meeting_uuid: meetingId });
        setIsParticipating(true);
        const response = await baseInstance.get(`/api/meetings/${meetingId}`);
        setMeetingMembers(response.data.meeting_member);
        setIsModalCenterOpen(false);
      } catch (error: any) {
        if (error.response?.status === 500) {
          // backend - 500번 응답 시 참여 상태로 변경
          setIsParticipating(true);

          // 멤버 목록 리렌더링
          const meetingId = window.location.pathname.split('/').pop();
          const response = await baseInstance.get(`/api/meetings/${meetingId}`);
          setMeetingMembers(response.data.meeting_member);

          // 모달 닫기
          setIsModalCenterOpen(false);
        } else if (error.response?.status === 400 && error.response?.data?.detail === '참여 인원 정원 초과 입니다') {
          setIsFullModalOpen(true);
        } else {
          // 기타 에러 처리
          // console.error('참여 확인 중 오류가 발생했습니다:', error);
        }
      }
    });
  };

  // 참여 취소 handler
  const handleCancelParticipation = async () => {
    try {
      const meetingId = window.location.pathname.split('/').pop();
      await authInstance.post(`/api/meetings/member/delete/`, { meeting_uuid: meetingId });

      // 참가 취소 성공 처리
      updateAfterCancellation(meetingId);
    } catch (error: any) {
      if (error.response?.status === 500) {
        // 500 에러 시에도 참가 취소 성공으로 처리
        const meetingId = window.location.pathname.split('/').pop();
        updateAfterCancellation(meetingId);
      } else {
        // console.error('참여 취소 중 오류가 발생했습니다:', error);
      }
    }
  };

  const updateAfterCancellation = async (meetingId: string | undefined) => {
    try {
      // 멤버 목록 리렌더링
      const response = await baseInstance.get(`/api/meetings/${meetingId}`);
      setMeetingMembers(response.data.meeting_member);

      setIsParticipating(false);
      setIsParticipatingCancelModalOpen(false); // modal 닫기
    } catch (error) {
      // console.error('멤버 목록 업데이트 중 오류가 발생했습니다:', error);
    }
  };

  // 좋아요 toggle
  const toggleLike = async () => {
    checkLoginAndProceed(async () => {
      try {
        const meetingId = window.location.pathname.split('/').pop();
        // 좋아요 상태에 따라 API 호출
        if (isLiked) {
          await authInstance.post(`/api/likes/delete/`, { uuid: meetingId });
          setIsLiked(false);
          setIsLikeModalOpen(true); // 좋아요 취소 Modal 열기
        } else {
          await authInstance.post(`/api/likes/`, { uuid: meetingId });
          setIsLiked(true);
          setIsLikeModalOpen(true); // 좋아요 추가 Modal 열기
        }
      } catch (error) {
        console.error('좋아요 토글 중 오류가 발생했습니다:', error);
      }
    });
  };

  // 이미지 modal 열기
  const openThunderImageModal = () => {
    setSelectedImages([selectedMeeting.meeting_image_url]);
    setIsThunderImageModalOpen(true);
  };
  const closeThunderImageModal = () => setIsThunderImageModalOpen(false);

  // 글 삭제 handler
  const handleDeleteMeeting = async () => {
    try {
      const meetingId = window.location.pathname.split('/').pop();
      await authInstance.post(`/api/meetings/delete/`, { meeting_uuid: meetingId });
      // 삭제 성공 후 - thunder 페이지로 이동
      window.location.href = '/thunder';
    } catch (error) {
      // console.error('모임 삭제 중 오류가 발생했습니다:', error);
    }
    setIsDeleteModalOpen(false);
  };

  // refresh token 없을 때 나오는 modal에서 로그인 버튼을 누르면 로그인 페이지로 이동
  const handleLogin = () => {
    navigate('/signin');
    setIsLoginModalOpen(false);
  };

  // 참여하기 버튼 클릭 시
  const handleParticipationClick = () => {
    checkLoginAndProceed(() => {
      setIsModalCenterOpen(true);
    });
  };

  // 수정하기 핸들러 정의
  const handleEditMeeting = () => {
    if (selectedMeeting) {
      navigate(`/thunder/thunderpostedit/${selectedMeeting.uuid}`, {
        state: {
          meeting_uuid: selectedMeeting.uuid, // meeting_uuid 추가
          title: selectedMeeting.title, // 제목
          description: selectedMeeting.description, // 내용
          payment_method_name: selectedMeeting.payment_method_name, // 결제 방식
          age_group_name: selectedMeeting.age_group_name, // 연령대
          gender_group_name: selectedMeeting.gender_group_name, // 성별
          meeting_time: selectedMeeting.meeting_time, // 날짜 및 시간
          meeting_image_url: selectedMeeting.meeting_image_url, // 이미지 URL
          maximum: selectedMeeting.maximum, // 최대 인원
          nickname: selectedMeeting.nickname, // 작성자 닉네임
          location: selectedMeeting.location_name, // 지역
        },
      });
    }
  };

  return (
    <motion.div
      className="relative mx-auto max-w-full overflow-y-scroll rounded-xl border-2 bg-white p-4 shadow-xl md:max-w-[1000px] xs:mb-20 xs:w-[400px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      <ThunderIdHeader selectedMeeting={selectedMeeting} profileImageUrl={profileImageUrl} />
      <ThunderIdContent
        selectedMeeting={selectedMeeting}
        isImageLoaded={isImageLoaded}
        setIsImageLoaded={setIsImageLoaded}
        openThunderImageModal={openThunderImageModal}
      />
      <ThunderIdComments meetingMembers={meetingMembers} />
      <ThunderIdFooter
        isLiked={isLiked}
        toggleLike={toggleLike}
        isHost={isHost}
        openDeleteModal={() => setIsDeleteModalOpen(true)}
        isParticipating={isParticipating}
        openCancelModal={() => setIsParticipatingCancelModalOpen(true)}
        handleParticipationClick={handleParticipationClick}
        meetingMembers={meetingMembers}
        selectedMeeting={selectedMeeting}
        handleEditMeeting={handleEditMeeting}
      />
      {/* 모달들 */}
      <ThunderImageModal isOpen={isThunderImageModalOpen} onClose={closeThunderImageModal} images={selectedImages} />
      <ModalCenter
        isOpen={isModalCenterOpen}
        onClose={() => setIsModalCenterOpen(false)}
        title1="참여하시겠습니까?"
        title2="">
        <div className="mt-12 flex w-full space-x-4">
          <motion.button
            onClick={() => setIsModalCenterOpen(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            className="w-full flex-1 rounded-xl border-2 border-orange-400 px-1 py-2 font-semibold text-orange-500 hover:bg-orange-50">
            취소
          </motion.button>
          <motion.button
            onClick={handleConfirmParticipation}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            className="w-full flex-1 rounded-xl bg-orange-500 px-2 py-3 font-semibold text-white hover:bg-orange-600">
            확인
          </motion.button>
        </div>
      </ModalCenter>
      <ModalCenter
        isOpen={isParticipatingCancelModalOpen}
        onClose={() => setIsParticipatingCancelModalOpen(false)}
        title1="참여를 취소하시겠습니까?"
        title2="">
        <div className="mt-12 flex w-full space-x-4">
          <motion.button
            onClick={() => setIsParticipatingCancelModalOpen(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            className="w-full flex-1 rounded-xl border-2 border-orange-400 px-1 py-2 font-semibold text-orange-500 hover:bg-orange-50">
            취소
          </motion.button>
          <motion.button
            onClick={handleCancelParticipation}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            className="w-full flex-1 rounded-xl bg-orange-500 px-2 py-3 font-semibold text-white hover:bg-orange-600">
            확인
          </motion.button>
        </div>
      </ModalCenter>
      <ModalCenter
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title1="현재 글을 삭제 합니다 계속할까요?"
        title2="현재 참여된 인원은 모두 나가기 됩니다">
        <div className="mt-12 flex w-full space-x-4">
          <motion.button
            onClick={() => setIsDeleteModalOpen(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            className="w-full flex-1 rounded-xl border-2 border-orange-400 px-1 py-2 font-semibold text-orange-500 hover:bg-orange-50">
            취소
          </motion.button>
          <motion.button
            onClick={handleDeleteMeeting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            className="w-full flex-1 rounded-xl bg-orange-500 px-2 py-3 font-semibold text-white hover:bg-orange-600">
            확인
          </motion.button>
        </div>
      </ModalCenter>
      <ModalCenter
        isOpen={isFullModalOpen}
        onClose={() => setIsFullModalOpen(false)}
        title1="현재 글은 참여하기 정원 초과입니다."
        title2="">
        <div className="mt-12 flex w-full space-x-4">
          <motion.button
            onClick={() => setIsFullModalOpen(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            className="w-full flex-1 rounded-xl bg-orange-500 px-2 py-3 font-semibold text-white hover:bg-orange-600">
            확인
          </motion.button>
        </div>
      </ModalCenter>
      <ModalBottom isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
        <div className="p-4 text-center">
          <p className="my-4 text-2xl font-semibold xs:text-xl">로그인이 필요한 서비스입니다.</p>
          <p className="my-2 text-gray-600 xs:text-[14px]">이 기능을 사용하려면 먼저 로그인해주세요.</p>
          <button className="mt-4 w-full rounded-lg bg-primary px-10 py-3 font-bold text-white" onClick={handleLogin}>
            로그인하기
          </button>
        </div>
      </ModalBottom>
      {/* 좋아요 Modal */}
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

export default ThunderId;
