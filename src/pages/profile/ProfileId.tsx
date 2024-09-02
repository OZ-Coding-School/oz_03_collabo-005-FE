import { useEffect, useState } from 'react';
import Image from '../../components/common/Image';
import { baseInstance } from '../../api/util/instance';
import { useParams } from 'react-router-dom';

interface User {
  profile_image_url?: string;
  nickname?: string;
  fti_type_name?: string | null;
  introduction?: string | null;
}

const ProfileId = () => {
  const param = useParams();
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    baseInstance.get(`/api/profile/${param.Id}/`).then((res) => {
      setUser(res.data);
    });
  }, [param.Id]);

  return (
    <div className="mt-4 p-4">
      <div className="relative mx-auto flex w-[30%] items-center justify-center pt-[30%] xs:w-[35%] xs:pt-[35%]">
        <Image
          className="absolute inset-0 h-full w-full rounded-full object-cover"
          src={user?.profile_image_url || '/images/anonymous_avatars.svg'}
          alt="프로필 이미지"
        />
      </div>
      <p className="my-5 h-10 w-full text-center text-[22px] font-bold xs:text-[18px]">{user?.nickname}</p>
      <div className="flex gap-3 text-[18px] font-medium xs:text-[16px]">
        <img src="/images/forkknife.svg" alt="fork&knife image" className="w-6" />
        {user?.fti_type_name || '아직 FTI 타입이 없어요'}
      </div>
      <div className="my-10 flex items-center gap-3">
        <img src="/images/jewelry.svg" alt="jewelry image" className="my-1 w-6 self-start" />
        <div className="text-[18px] font-medium xs:text-[16px]">
          내 소개
          <p className="text-[18px] font-normal text-[#2D2C2C] xs:text-[16px]">{user?.introduction}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileId;
