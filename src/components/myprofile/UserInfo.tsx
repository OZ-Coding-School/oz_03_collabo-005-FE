import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface User {
  fti_type: string | null;
  introduce: string | null;
  nickname: string;
  profile_image_url: string | null;
  spicy_preference: number | null;
}

interface UserInfoProps {
  user?: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const location = useLocation();
  const isProfilePage = location.pathname.includes('/profile/');

  return (
    <div className="flex h-[35%] flex-col items-center justify-evenly p-[1rem]">
      <div className="relative flex w-[30%] items-center justify-center pt-[30%] xs:w-[35%] xs:pt-[35%]">
        <Link to={user ? `/profile/${user.nickname}` : '#'}>
          <img
            className="absolute inset-0 h-full w-full rounded-full object-cover"
            src={user?.profile_image_url || '/images/anonymous_avatars.svg'}
            alt="프로필 이미지"
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
            (user.fti_type ? (
              <p className="text-[16px] text-[#AD5E33] xs:text-[12px]">{user.fti_type}</p>
            ) : (
              <Link to="/FTI" className="text-[16px] text-[#AD5E33] xs:text-[12px]">
                테스트를 통해 FTI타입을 확인해보세요
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default UserInfo;
