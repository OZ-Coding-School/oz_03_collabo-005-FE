import { Link } from 'react-router-dom';
import UserInfo from '../../components/myprofile/UserInfo';
import UserLink from '../../components/myprofile/UserLink';
import { useUserStore } from '../../store/store';
import { useEffect, useState } from 'react';
import ModalCenter from '../../components/common/ModalCenter';

const MyProfile = () => {
  const [isModalCenterOpen, setIsModalCenterOpen] = useState(false);
  const openModalCenter = () => setIsModalCenterOpen(true);
  const closeModalCenter = () => setIsModalCenterOpen(false);

  const { user, setUser } = useUserStore();

  useEffect(() => {
    //여기에 axios 요청 들어가서 토큰확인하는거 들어가면 될 듯 -> 확인되면 store에 저장하면 될 듯!
    setUser({
      id: 1,
      profileImageUrl:
        'https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aHVtYW58ZW58MHx8MHx8fDA%3D',
      nickname: '족발러버',
      introduce: '족발러버입니다. 잘 부탁드려요~!',
      ftiType: '고독한 미식가(AIN)',
    });
    // 유저 토큰 없거나 확인 실패하면 undefined로 설정
    // setUser(undefined);
  }, []);

  const openPopup = (url: string) => {
    // 모바일에서는 새 창으로 열리는지 확인 필요
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.open(url, '_blank');
    } else {
      window.open(url, 'popupWindow', 'width=600,height=700,scrollbars=yes,resizable=yes');
    }
  };

  const handlePreventNavigate = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!user) {
      e.preventDefault();
      openModalCenter();
    }
  };

  return (
    <>
      <>
        {user ? <UserInfo user={user} /> : <UserInfo />}
        <div className="flex items-center justify-center p-[16px]">
          <Link
            to={user ? '/flavor' : '#'}
            onClick={handlePreventNavigate}
            className="mr-2 flex h-[62px] w-[43%] items-center justify-center rounded-lg bg-primary text-[20px] font-bold text-white xs:h-[42px] xs:text-[16px]">
            내 입맛 설정
          </Link>
          <Link
            to={user ? '/myprofile/myprofileedit' : '#'}
            onClick={handlePreventNavigate}
            className="ml-2 flex h-[62px] w-[43%] items-center justify-center rounded-lg bg-[#F5E3DB] text-[20px] font-bold xs:h-[42px] xs:text-[16px]">
            내 프로필
          </Link>
        </div>
        <UserLink text={'FTI 검사'} src={'/FTI'} isUserLoggedIn={true} />
        <UserLink text={'나의 소셜 다이닝'} src={'/myprofile/myprofilethunder'} isUserLoggedIn={!!user} />
        <UserLink text={'나의 맛있는 발견'} src={'/myprofile/myprofileboard'} isUserLoggedIn={!!user} />
        <UserLink text={'이용 약관'} src={'/terms'} isUserLoggedIn={true} />
        <div className="flex items-center justify-center p-[16px]">
          <button
            onClick={() => openPopup('https://pf.kakao.com/_xixaBxoG/chat')}
            className="ml-2 flex h-[6vh] w-[43%] items-center justify-center text-[18px] font-bold xs:text-[14px]">
            의견 보내기
          </button>
          <Link
            to={'/'}
            className="ml-2 flex h-[6vh] w-[43%] items-center justify-center text-[18px] font-bold xs:text-[14px]">
            <button>밥피엔스란?</button>
          </Link>
        </div>
      </>
      <ModalCenter
        isOpen={isModalCenterOpen}
        title1="로그인이 필요한 서비스 입니다."
        title2=""
        onClose={closeModalCenter}>
        <div className="mt-8 flex w-full space-x-4">
          <button
            onClick={closeModalCenter}
            className="w-full flex-1 rounded-xl border-2 border-orange-400 px-1 py-2 font-semibold text-orange-500 hover:bg-orange-50">
            취소
          </button>
          <Link to="/signin" className="flex-1">
            <button className="w-full rounded-xl bg-orange-500 px-2 py-3 font-semibold text-white hover:bg-orange-600">
              로그인
            </button>
          </Link>
        </div>
      </ModalCenter>
    </>
  );
};

export default MyProfile;
