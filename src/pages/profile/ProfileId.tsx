import Image from '../../components/common/Image';
import { useUserStore } from '../../store/store';

const ProfileId = () => {
  // 주소의 userid로 요청을 보내서 프로필 정보 받아 올 것. 지금은 임시로 store에서 가져옴
  const { user } = useUserStore();

  return (
    <div className="mt-4 p-4">
      <div className="relative mx-auto flex w-[30%] items-center justify-center pt-[30%] xs:w-[35%] xs:pt-[35%]">
        <Image
          className="absolute inset-0 h-full w-full rounded-full object-cover"
          src={user?.profileImageUrl || '/images/anonymous_avatars.svg'}
          alt="프로필 이미지"
        />
      </div>
      <div className="my-8 flex justify-center">
        <p className="text-[22px] font-bold xs:text-[18px]">{user?.nickname}</p>
      </div>
      <div className="flex gap-3 text-[18px] font-medium xs:text-[16px]">
        <img src="/images/forkknife.svg" alt="fork&knife image" />
        {user?.ftiType || '아직 FTI 타입이 없어요'}
      </div>
      <div className="my-10 flex items-center gap-3">
        <img src="/images/jewelry.svg" alt="jewelry image" className="my-1 self-start" />
        <div className="text-[18px] font-medium xs:text-[16px]">
          내 소개
          <p className="text-[18px] font-normal text-[#2D2C2C] xs:text-[16px]">{user?.introduce}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileId;
