import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types/types';

interface UserInfoProps {
  user?: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  return (
    <div className="flex h-[35%] flex-col items-center justify-evenly p-[1rem]">
      <div className="relative flex w-[30%] items-center justify-center pt-[30%] xs:w-[35%] xs:pt-[35%]">
        <Link to={user ? `/profile/${user.id}` : '#'}>
          <img
            className="absolute inset-0 h-full w-full rounded-full object-cover"
            src={user?.profileImageUrl || '/images/anonymous_avatars.svg'}
            alt="프로필 이미지"
          />
        </Link>
      </div>
      {user ? (
        <div className="flex h-[8rem] flex-col items-center justify-center">
          <p className="text-[22px] font-bold xs:text-[18px]">{user.nickname}</p>
          {user?.ftiType ? (
            <p className="text-[16px] text-[#AD5E33] xs:text-[12px]">{user.ftiType}</p>
          ) : (
            <Link to={'/FTI'} className="text-[16px] text-[#AD5E33] xs:text-[12px]">
              테스트를 통해 FTI타입을 확인해보세요.
            </Link>
          )}
        </div>
      ) : (
        <Link to="/signin" className="flex h-[8rem] flex-col items-center justify-center">
          <p className="text-[22px] font-bold xs:text-[18px]">로그인이 필요합니다</p>
          <p className="text-[16px] text-[#AD5E33] xs:text-[12px]">로그인 후 이용해주세요</p>
        </Link>
      )}
    </div>
  );
};

export default UserInfo;
