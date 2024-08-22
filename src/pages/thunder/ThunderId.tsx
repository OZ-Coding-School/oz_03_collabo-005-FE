import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ModalCenter from '../../components/common/ModalCenter';
import ContentLoader from 'react-content-loader';
import { meetingList } from '../../data/meetingList';

// ThunderId - 소셜다이닝 글 목록 조회
interface Meeting {
  id: number;
  user_id: number;
  title: string;
  location_id: string;
  payment_method: string;
  age_group: string;
  gender_group: string;
  appointment_time: string;
  description: string;
  image_url?: string;
  hits: number;
  created_at: string;
  updated_at: string;
}

const ThunderId = () => {
  const [isModalCenterOpen, setIsModalCenterOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isParticipating, setIsParticipating] = useState(false);
  const [isParticipatingCancelModalOpen, setIsParticipatingCancelModalOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    // URL 경로에서 meetingList ID를 추출하여 정수 변환
    const meetingId = parseInt(window.location.pathname.split('/').pop() || '0', 10);

    // meetingList에서 meetingId와 일치하는 모임 찾기
    const meeting = meetingList.find((meeting) => meeting.id === meetingId);
    // 찾은 모임을 상태로 설정 .모임이 없으면 null.
    setSelectedMeeting(meeting || null);
  }, []);

  if (!selectedMeeting) {
    return <div>모임 정보를 불러올 수 없습니다.</div>;
  }

  // 참여하기 modal
  const openModalCenter = () => setIsModalCenterOpen(true);
  const closeModalCenter = () => setIsModalCenterOpen(false);

  // 참여취소 modal
  const openCancelModal = () => setIsParticipatingCancelModalOpen(true);
  const closeCancelModal = () => setIsParticipatingCancelModalOpen(false);

  // 참여 확인 handler
  const handleConfirmParticipation = () => {
    setIsParticipating(true);
    closeModalCenter();
  };

  // 참여 취소 handler
  const handleCancelParticipation = () => {
    setIsParticipating(false);
    closeCancelModal();
  };

  // 좋아요 toggle
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="relative mx-auto max-w-full rounded-lg bg-white p-4">
      {/* 모임 위치 정보 */}
      <div className="mb-2 flex items-center">
        <div className="mr-2 rounded-lg border-2 border-[#ffe7e2] bg-[#FAF2F0] px-2 py-1 text-gray-800">
          {selectedMeeting.location_id}
        </div>
      </div>

      {/* 모임 제목 */}
      <div className="mb-4 text-xl font-bold">{selectedMeeting.title}</div>

      {/* 모임 정보 */}
      <div className="mb-4 flex items-center text-sm text-gray-500">
        {/* 결제 방식 */}
        <div className="mr-2 rounded-md border-2 border-gray-200 bg-slate-100 px-2 py-1 text-black">
          {selectedMeeting.payment_method}
        </div>

        {/* 연령대 */}
        <div className="mr-2 rounded-md border-2 border-gray-200 bg-slate-100 px-2 py-1 text-black">
          {selectedMeeting.age_group}
        </div>

        {/* 성별 */}
        <div className="mr-2 rounded-md border-2 border-gray-200 bg-slate-100 px-2 py-1 text-black">
          {selectedMeeting.gender_group}
        </div>
      </div>
      {/* 작성자 정보 */}
      <div className="mb-4 flex items-center">
        <img src="../images/anonymous_avatars.svg" alt="프로필 사진" className="mr-2 h-10 w-10 rounded-full" />
        <div>
          <div className="flex items-center">
            <div className="text-sm font-medium">족발 러버</div>
            <div className="ml-2 text-xs font-medium text-gray-500">20분전</div>
          </div>
        </div>
      </div>
      <hr className="mb-5 mt-5 border border-gray-200" />
      {/* 이미지 불러올 때  content-loader 표시*/}
      {!isImageLoaded && (
        <ContentLoader height={200} width={500} speed={2} backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
          <rect x="0" y="56" rx="3" ry="3" width="500" height="10" />
          <rect x="0" y="72" rx="3" ry="3" width="400" height="10" />
          <rect x="0" y="88" rx="3" ry="3" width="300" height="10" />
        </ContentLoader>
      )}
      <img
        src={selectedMeeting.image_url}
        alt="마라탕"
        className={`mb-4 mt-8 h-full w-full rounded-lg object-cover ${isImageLoaded ? 'block' : 'hidden'}`}
        onLoad={() => setIsImageLoaded(true)}
      />
      {/* 모임 일정 */}
      <div className="mb-4 flex h-full w-full items-center rounded-[11.5px] border-2 border-[#ffe7e2] text-sm text-gray-500">
        <img src="../images/ThunderCalender.svg" alt="캘린더" className="mr-[10px] h-[70px] w-[70px]" />
        <p className="ml-2 text-[14px] text-[#333333]">{new Date(selectedMeeting.appointment_time).toLocaleString()}</p>
      </div>
      {/* 모임 설명 */}
      <p className="mb-4 text-[#333333]">{selectedMeeting.description}</p>
      {/* 관심 및 조회수 */}
      <div className="mb-4 mt-20 flex items-center">
        <p className="text-sm text-black">관심</p>
        <p className="ml-1 text-sm text-black">1</p>
        <p className="ml-2 text-sm text-black">조회수</p>
        <p className="ml-1 text-sm text-black">{selectedMeeting.hits}</p>
      </div>
      <hr className="mb-5 mt-5 border-2 border-gray-200" />
      {/* 같이 드실 멤버 */}
      <div className="mb-4 flex items-center">
        <div className="text-sm font-bold">같이 드실 멤버</div>
      </div>
      {/* 같이 드실 멤버 프로필 */}
      <div className="mb-4 flex items-center">
        <img
          src="../images/anonymous_avatars.svg"
          alt="같이 드실 멤버 프로필 사진"
          className="mr-2 h-10 w-10 rounded-full"
        />
        <div>
          <p className="text-sm">족발 러버</p>
          <p className="text-xs text-gray-500">만남을 중요시 생각하는 ESFP 입니다</p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-white p-4">
        {/* 좋아요 button */}
        <motion.img
          src={isLiked ? '../images/SocialDiningLikeActive.svg' : '../images/SocialDiningLike.svg'}
          alt="좋아요"
          className="cursor-pointer rounded-lg py-2 text-white"
          onClick={toggleLike}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          style={{ width: '50px', height: '50px' }}
        />

        {isParticipating ? (
          <div className="ml-8 mr-2 flex w-full items-center justify-between">
            {/* 참가 취소 button */}
            <motion.button
              onClick={openCancelModal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              className="flex h-[50px] w-full items-center justify-center rounded-lg border-2 border-orange-400 py-2 font-bold text-orange-500 hover:bg-orange-50">
              참가 취소
            </motion.button>

            {/* 참가 취소 button을 누르면 나오는 modal */}
            <ModalCenter
              isOpen={isParticipatingCancelModalOpen}
              onClose={closeCancelModal}
              title1="참여를 취소하시겠습니까?"
              title2="">
              <div className="mt-12 flex w-full space-x-4">
                {/* 취소 버튼 */}
                <motion.button
                  onClick={closeCancelModal}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 1 }}
                  className="w-full flex-1 rounded-xl border-2 border-orange-400 px-1 py-2 font-semibold text-orange-500 hover:bg-orange-50">
                  취소
                </motion.button>

                {/* 참여하기 버튼 을 누르면 나오는 modal 에서 확인 button */}
                <motion.button
                  onClick={handleCancelParticipation}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 1 }}
                  className="w-full flex-1 rounded-xl bg-orange-500 px-2 py-3 font-semibold text-white hover:bg-orange-600">
                  확인
                </motion.button>
              </div>
            </ModalCenter>

            <motion.button />
            <Link
              to="/chatroom"
              className="ml-4 flex h-[50px] w-full items-center justify-center rounded-lg bg-orange-500 py-2 font-bold text-white hover:bg-orange-600">
              소통방
            </Link>
          </div>
        ) : (
          <motion.button
            onClick={openModalCenter}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            className="ml-8 mr-2 flex h-[50px] w-full items-center justify-center rounded-lg bg-orange-500 py-2 font-bold text-white hover:bg-orange-600">
            참여하기 (1/3)
          </motion.button>
        )}

        {/*  참여하기 버튼 누를 시 ModalCenter Open*/}
        <ModalCenter isOpen={isModalCenterOpen} onClose={closeModalCenter} title1="참여하시겠습니까?" title2="">
          <div className="mt-12 flex w-full space-x-4">
            <motion.button
              onClick={closeModalCenter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              className="w-full flex-1 rounded-xl border-2 border-orange-400 px-1 py-2 font-semibold text-orange-500 hover:bg-orange-50">
              취소
            </motion.button>

            {/* 확인 버튼을 클릭하면 참여 확인 handler 실행 */}
            <motion.button
              onClick={handleConfirmParticipation}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              className="w-full flex-1 rounded-xl bg-orange-500 px-2 py-3 font-semibold text-white hover:bg-orange-600">
              확인
            </motion.button>
          </div>
        </ModalCenter>
      </div>
    </div>
  );
};

export default ThunderId;
