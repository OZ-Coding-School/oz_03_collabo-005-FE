import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authInstance } from '../../api/util/instance';
import ModalCenter from '../common/ModalCenter';

interface User {
  nickname: string;
  introduce: string | null;
  fti_type_name: string | null;
  spicy_preference: number | null;
  profile_image_url: string | null;
}

interface UserInfoProps {
  user?: User;
  refetchUserProfile: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, refetchUserProfile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isProfilePage = location.pathname.includes('/profile/');

  const [isModalCenterOpen, setIsModalCenterOpen] = useState(false);
  const openModalCenter = () => setIsModalCenterOpen(true);
  const closeModalCenter = () => setIsModalCenterOpen(false);

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = '/images/anonymous_avatars.svg';
  };

  const handleConfirmFti = () => {
    const FtiResults = localStorage.getItem('FtiResults');
    if (FtiResults) {
      openModalCenter();
    } else {
      navigate('/FTI');
    }
  };

  const handleSaveResults = () => {
    const FtiResults = { fti_style: [localStorage.getItem('FtiResults')] };
    if (FtiResults) {
      authInstance.post('/api/ftitests/result/', FtiResults).then(() => {
        refetchUserProfile();
        closeModalCenter();
      });
    }
  };

  return (
    <div className="m-[1rem] flex h-[300px] flex-col items-center justify-evenly xs:m-2 xs:h-[200px]">
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
      {!user ? (
        <Link to="/signin" className="flex h-[8rem] flex-col items-center justify-center">
          <p className="text-[22px] font-bold xs:text-[18px]">로그인이 필요합니다</p>
          <p className="text-[16px] text-[#AD5E33] xs:text-[12px]">로그인 후 이용해주세요</p>
        </Link>
      ) : (
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
      <ModalCenter isOpen={isModalCenterOpen} title1="저장된 FTI 검사 결과가 있습니다." onClose={closeModalCenter}>
        <p className="text-[#666666] xs:text-[14px]">이전 테스트 결과를 프로필에 저장하시겠어요?</p>
        <div className="mt-8 flex w-full gap-3">
          <button
            onClick={closeModalCenter}
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
