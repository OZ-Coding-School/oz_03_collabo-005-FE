import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authInstance } from '../../api/util/instance';
import ModalCenter from '../common/ModalCenter';

// 사용자 정보 interface 정의
interface User {
  nickname: string;
  introduce: string | null;
  fti_type_name: string | null;
  spicy_preference: number | null;
  profile_image_url: string | null;
}

// UserInfo 컴포넌트의 props interface 정의
interface UserInfoProps {
  user?: User;
  refetchUserProfile: () => void;
}

// UserInfo 컴포넌트를 정의
const UserInfo: React.FC<UserInfoProps> = ({ user, refetchUserProfile }) => {
  // 현재 위치와 네비게이션 함수를 가져옵니다
  const location = useLocation();
  const navigate = useNavigate();
  // 현재 페이지가 프로필 페이지인지 확인
  const isProfilePage = location.pathname.includes('/profile/');

  // 모달 상태 관리
  const [isModalCenterOpen, setIsModalCenterOpen] = useState(false);
  const openModalCenter = () => setIsModalCenterOpen(true);
  const closeModalCenter = () => setIsModalCenterOpen(false);

  // 이미지 로드 실패 시 기본 이미지를 표시
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = '/images/anonymous_avatars.svg';
  };

  // FTI 확인 버튼 클릭 handler
  const handleConfirmFti = () => {
    const FtiResults = localStorage.getItem('FtiResults');
    if (FtiResults) {
      openModalCenter();
    } else {
      navigate('/fti');
    }
  };

  // FTI 결과 저장 handler
  const handleSaveResults = () => {
    const resultString = localStorage.getItem('FtiResults');
    if (!resultString) {
      return;
    }
    const parsedResults = JSON.parse(resultString);
    const FtiResults = { fti_style: parsedResults };
    authInstance
      .post('/api/ftitests/result/', FtiResults)
      .then(() => {
        refetchUserProfile();
        closeModalCenter();
      })
      .catch((error) => {
        console.error('Error saving results:', error);
      });
  };

  return (
    <div className="m-[1rem] flex h-[300px] flex-col items-center justify-evenly xs:m-2 xs:mt-4 xs:h-[200px]">
      {/* 프로필 이미지 section */}
      <div className="relative flex w-[30%] items-center justify-center pt-[30%] xs:w-[35%] xs:pt-[35%]">
        <Link to={user ? `/profile/${user.nickname}` : '#'}>
          <img
            className="absolute inset-0 h-full w-full rounded-full object-cover"
            src={user?.profile_image_url || '/images/anonymous_avatars.svg'}
            alt="프로필 이미지"
            onError={handleImageError}
          />
        </Link>
      </div>
      {/* 사용자 정보 section */}
      {!user ? (
        // 로그인하지 않은 경우에 나오는 요소 및 스타일 정의
        <Link to="/signin" className="flex h-[8rem] flex-col items-center justify-center">
          <p className="text-[22px] font-bold xs:text-[18px]">로그인이 필요합니다</p>
          <p className="text-[16px] text-[#AD5E33] xs:text-[12px]">로그인 후 이용해주세요</p>
        </Link>
      ) : (
        // 로그인한 경우 나오는 요소 및 스타일 정의
        <div className="flex h-[8rem] flex-col items-center justify-center">
          <p className="text-[22px] font-bold xs:text-[18px]">{user.nickname}</p>
          {!isProfilePage &&
            (user.fti_type_name ? (
              <p className="text-[16px] text-[#AD5E33] xs:text-[12px]">{user.fti_type_name}</p>
            ) : (
              <div onClick={handleConfirmFti} className="cursor-pointer text-[16px] text-[#AD5E33] xs:text-[12px]">
                테스트를 통해 FTI타입을 확인해보세요
              </div>
            ))}
        </div>
      )}
      {/* FTI 결과 저장 Modal */}
      <ModalCenter isOpen={isModalCenterOpen} title1="저장된 FTI 검사 결과가 있습니다." onClose={closeModalCenter}>
        <p className="text-[#666666] xs:text-[14px]">이전 테스트 결과를 프로필에 저장하시겠어요?</p>
        <div className="mt-8 flex w-full gap-3">
          <button
            onClick={() => navigate('/fti')}
            className="w-full rounded-xl border-2 border-orange-400 px-1 py-2 font-semibold text-orange-500 hover:bg-orange-50">
            FTI 테스트로 이동
          </button>
          <button
            onClick={handleSaveResults}
            className="w-full rounded-xl border-2 border-orange-500 bg-orange-500 px-1 py-2 font-semibold text-white hover:border-orange-600 hover:bg-orange-600">
            결과 저장
          </button>
        </div>
      </ModalCenter>
    </div>
  );
};

export default UserInfo;
