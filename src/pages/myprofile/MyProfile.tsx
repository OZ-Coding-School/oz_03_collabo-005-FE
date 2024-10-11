import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import Loading from '../../components/common/Loading';
import UserInfo from '../../components/myprofile/UserInfo';
import UserLink from '../../components/myprofile/UserLink';
import ModalBottom from '../../components/common/ModalBottom';
import ModalCenter from '../../components/common/ModalCenter';
import { authInstance, logout } from '../../api/util/instance';
import { getCookie } from '../../utils/cookie';

const MyProfile = () => {
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalCenterOpen, setIsModalCenterOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    if (getCookie('refresh')) {
      try {
        const res = await authInstance.get('/api/profile');
        setUser(res.data);
      } catch (error) {
        console.error('Failed to fetch user profile', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const openPopup = (url: string) => {
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
      setIsModalCenterOpen(true);
    }
  };

  const handleLogout = () => {
    try {
      logout('noRedirect');
      setUser(undefined);
    } catch (error) {
      console.error('Failed to log out', error);
    } finally {
      setIsLogoutConfirmOpen(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <UserInfo user={user} refetchUserProfile={fetchUserProfile} />
      <div className="flex items-center justify-center p-[16px] xs:p-2">
        <Link
          to={user ? '/flavor' : '#'}
          onClick={handlePreventNavigate}
          className="mr-2 flex h-[52px] w-[43%] items-center justify-center rounded-lg bg-primary text-[20px] font-bold text-white transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-orange-600 active:scale-95 xs:h-[42px] xs:text-[14px]">
          내 입맛 설정
        </Link>
        <Link
          to={user ? '/myprofile/myprofileedit' : '#'}
          state={{ user }}
          onClick={handlePreventNavigate}
          className="ml-2 flex h-[52px] w-[43%] items-center justify-center rounded-lg bg-[#F5E3DB] text-[20px] font-bold transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-[#cfc1b9] active:scale-95 xs:h-[42px] xs:text-[14px]">
          내 프로필
        </Link>
      </div>
      <UserLink text={'FTI 검사'} src={'/fti'} isUserLoggedIn={true} />
      <UserLink text={'나의 소셜 다이닝'} src={'/myprofile/myprofilethunder'} isUserLoggedIn={!!user} />
      <UserLink text={'나의 맛있는 발견'} src={'/myprofile/myprofileboard'} isUserLoggedIn={!!user} />
      <Link to={'https://suist.notion.site/e2c6e050f097489fb620469d397f70d8'} target="_blank">
        <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 200 }}>
          <div className="flex w-full cursor-pointer items-center justify-between p-[12px] px-4 text-[20px] hover:rounded-lg hover:font-bold hover:text-primary xs:py-[0.7rem] xs:text-[14px]">
            이용약관
            <IoIosArrowForward className="text-[20px] xs:text-[16px]" />
          </div>
        </motion.div>
      </Link>
      <Link to={'/updatenote'}>
        <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 200 }}>
          <div className="flex w-full cursor-pointer items-center justify-between p-[12px] px-4 text-[20px] hover:rounded-lg hover:font-bold hover:text-primary xs:py-[0.7rem] xs:text-[14px]">
            개발자 노트
            <IoIosArrowForward className="text-[20px] xs:text-[16px]" />
          </div>
        </motion.div>
      </Link>
      {user !== undefined && (
        <motion.div
          onClick={() => setIsLogoutConfirmOpen(true)}
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 200 }}>
          <div className="flex w-full cursor-pointer items-center justify-between p-[12px] px-4 text-[20px] hover:rounded-lg hover:font-bold hover:text-primary xs:py-[0.7rem] xs:text-[14px]">
            로그아웃
            <IoIosArrowForward className="text-[20px] xs:text-[16px]" />
          </div>
        </motion.div>
      )}
      <div className="flex items-center justify-center p-[16px] xs:p-2">
        <button
          onClick={() => openPopup('https://pf.kakao.com/_xixaBxoG/chat')}
          className="ml-2 flex h-[6vh] w-[43%] items-center justify-center text-[18px] font-bold xs:text-[14px]">
          의견 보내기
        </button>
        <Link
          to={'/introduction'}
          className="ml-2 flex h-[6vh] w-[43%] items-center justify-center text-[18px] font-bold xs:text-[14px]">
          <button>밥피엔스란?</button>
        </Link>
      </div>
      <ModalCenter
        isOpen={isModalCenterOpen}
        title1="로그인이 필요한 서비스 입니다."
        title2=""
        onClose={() => setIsModalCenterOpen(false)}>
        <p className="text-[#666666] xs:text-[14px]">로그인 페이지로 이동하시겠어요?</p>
        <div className="mt-8 flex w-full justify-evenly gap-4">
          <button
            onClick={() => setIsModalCenterOpen(false)}
            className="w-full rounded-xl border-2 border-orange-400 px-1 py-2 font-semibold text-orange-500 hover:bg-orange-50">
            취소
          </button>
          <button
            onClick={() => {
              navigate('/signin');
            }}
            className="w-full rounded-xl border-2 border-orange-500 bg-orange-500 px-1 py-2 font-semibold text-white hover:border-orange-600 hover:bg-orange-600">
            로그인
          </button>
        </div>
      </ModalCenter>
      <ModalBottom isOpen={isLogoutConfirmOpen} onClose={() => setIsLogoutConfirmOpen(false)}>
        <div className="mx-auto h-[6px] w-[66px] rounded-[8px] bg-[#d9d9d9]" />
        <p className="my-8 text-center text-[24px] font-bold">로그아웃 하시겠습니까?</p>
        <p className="text-center text-[#666666] xs:text-[14px]">로그인 상태를 유지하고 싶다면, 취소를 눌러주세요.</p>
        <div className="mb-4 mt-8 flex w-full gap-4">
          <button
            onClick={() => setIsLogoutConfirmOpen(false)}
            className="w-full rounded-xl border-2 border-orange-400 px-1 py-2 font-semibold text-orange-500 hover:bg-orange-50">
            취소
          </button>
          <button
            onClick={handleLogout}
            className="w-full rounded-xl border-2 border-orange-500 bg-orange-500 px-1 py-2 font-semibold text-white hover:border-orange-600 hover:bg-orange-600">
            로그아웃
          </button>
        </div>
      </ModalBottom>
    </>
  );
};

export default MyProfile;
