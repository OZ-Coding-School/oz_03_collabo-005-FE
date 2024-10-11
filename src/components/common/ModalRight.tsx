import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/cookie';
import { authInstance, logout } from '../../api/util/instance';
import { IoIosArrowForward } from 'react-icons/io';
import { PiCoffee } from 'react-icons/pi';
import { PiFileDoc } from 'react-icons/pi';
import { PiNotebookLight } from 'react-icons/pi';
import { RiEdit2Fill } from 'react-icons/ri';
import ModalCenter from '../common/ModalCenter';
import { motion } from 'framer-motion';

interface ModalRightProps {
  isOpen: boolean;
  onClose: () => void;
  title1?: string;
  title2?: string;
  children?: React.ReactNode;
}

const ModalRight: React.FC<ModalRightProps> = ({ isOpen, onClose, title1, title2, children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ profileNickname: string; ftiType: string; profileImage: string } | undefined>(
    undefined,
  );
  const [isModalCenterOpen, setIsModalCenterOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [isSocialDiningPromptOpen, setIsSocialDiningPromptOpen] = useState(false);
  const [isDeliciousDiscoveryPromptOpen, setIsDeliciousDiscoveryPromptOpen] = useState(false);

  const closeModalCenter = () => setIsModalCenterOpen(false);

  const openLoginPrompt = () => setIsLoginPromptOpen(true);
  const closeLoginPrompt = () => setIsLoginPromptOpen(false);

  const openSocialDiningPrompt = () => setIsSocialDiningPromptOpen(true);
  const closeSocialDiningPrompt = () => setIsSocialDiningPromptOpen(false);

  const openDeliciousDiscoveryPrompt = () => setIsDeliciousDiscoveryPromptOpen(true);
  const closeDeliciousDiscoveryPrompt = () => setIsDeliciousDiscoveryPromptOpen(false);

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = '/images/anonymous_avatars.svg';
  };

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
        fetchUserProfile();
        closeModalCenter();
      })
      .catch((error) => {
        console.error('Error saving results:', error);
      });
  };

  const fetchUserProfile = async () => {
    if (getCookie('refresh')) {
      try {
        const res = await authInstance.get('/api/profile');
        const { nickname, fti_type_name, profile_image_url } = res.data; // API 응답에서 필요한 데이터 추출
        const profileImage = profile_image_url || '/images/anonymous_avatars.svg';
        setUser({ profileNickname: nickname, ftiType: fti_type_name, profileImage }); // 상태 업데이트
      } catch (error) {
        console.error('Failed to fetch user profile', error);
        setUser({ profileNickname: '', ftiType: '', profileImage: '/images/anonymous_avatars.svg' });
      }
    }
  };

  useEffect(() => {
    fetchUserProfile(); // 컴포넌트가 mount될 때 사용자 프로필을 즉시 가져옴

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const handleLogout = () => {
    try {
      logout('noRedirect');
      setUser(undefined);
      navigate('/'); // 메인 페이지 이동
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleLoginRedirect = () => {
    closeLoginPrompt();
    onClose();
    navigate('/signin');
    fetchUserProfile(); // 로그인 리디렉션 후 사용자 프로필을 즉시 가져오기
  };

  const handleSocialDiningClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!user) {
      e.preventDefault();
      openSocialDiningPrompt();
    }
  };

  const handleDeliciousDiscoveryClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!user) {
      e.preventDefault();
      openDeliciousDiscoveryPrompt();
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black bg-opacity-50" onClick={onClose}>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.2 }}
        className="pointer-events-auto relative mt-[60px] h-[1024px] w-[600px] rounded-lg border bg-white bg-opacity-80 shadow-slate-800 drop-shadow-2xl backdrop-blur-lg"
        onClick={(e) => e.stopPropagation()}>
        <div className="text-center text-2xl font-semibold xs:text-[22px] xxs:text-[20px]">{title1}</div>
        <div className="text-center text-2xl font-semibold xs:text-[22px] xxs:text-[20px]">{title2}</div>
        <div className="mt-4 text-center">{children}</div>
        {user ? (
          <div className="flex flex-col items-center justify-center p-[16px] xs:p-2">
            <div className="m-[1rem] flex h-[300px] flex-col items-center justify-evenly xs:m-2 xs:mt-4 xs:h-[200px]">
              <div className="relative flex h-[220px] w-[200px] items-center justify-center">
                <Link to={user ? `/profile/${user.profileNickname}` : '#'}>
                  <img
                    className="absolute inset-0 rounded-full object-cover"
                    src={user?.profileImage || '/images/anonymous_avatars.svg'}
                    alt="프로필 이미지"
                    onError={handleImageError}
                  />
                  <RiEdit2Fill className="absolute bottom-0 right-0 rounded-full bg-orange-500 text-[50px] text-white" />{' '}
                </Link>
              </div>
              <div className="flex h-[8rem] flex-col items-center justify-center">
                <p className="text-[22px] font-bold xs:text-[18px]">{user.profileNickname}</p>
                <p className="text-[16px] text-[#AD5E33] xs:text-[12px]">{user.ftiType}</p>
              </div>
              <ModalCenter
                isOpen={isModalCenterOpen}
                title1="저장된 FTI 검사 결과가 있습니다."
                onClose={closeModalCenter}>
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
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-[16px] xs:p-2">
            <div className="m-[1rem] flex h-[300px] flex-col items-center justify-evenly">
              <div className="relative flex h-[220px] w-[200px] items-center justify-center">
                <img
                  className="absolute rounded-full object-cover"
                  src="/images/anonymous_avatars.svg"
                  alt="프로필 이미지"
                />
              </div>
              <Link
                to="/signin"
                className="flex h-[8rem] flex-col items-center justify-center"
                onClick={handleLoginRedirect}>
                <p className="text-[22px] font-bold xs:text-[18px]">여기를 눌러 로그인 하기</p>
                <p className="text-[16px] text-[#AD5E33] xs:text-[12px]">로그인 후 이용해주세요</p>
              </Link>
            </div>
          </div>
        )}
        <div className="flex flex-col items-center justify-center">
          <Link
            to={user ? '/flavor' : '#'}
            onClick={!user ? openLoginPrompt : undefined}
            className="mt-4 flex h-[52px] w-[82%] items-center justify-center rounded-full bg-primary text-[20px] font-bold text-white transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-orange-600 active:scale-95 xs:h-[42px] xs:text-[14px]">
            내 입맛 설정
          </Link>
          <Link
            to="/fti"
            state={{ user }}
            onClick={onClose}
            className="mt-4 flex h-[52px] w-[82%] items-center justify-center rounded-full bg-[#F5E3DB] text-[20px] font-bold transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-[#cfc1b9] active:scale-95">
            FTI 검사
          </Link>
        </div>
        <div className="mt-2 flex flex-col items-center justify-center">
          <Link
            to={user ? '/myprofile/myprofilethunder' : '#'}
            onClick={handleSocialDiningClick}
            className="mt-8 flex h-[52px] w-[82%] items-center justify-start rounded-full text-[20px] font-bold text-black">
            <PiCoffee className="mr-2 text-[20px]" />
            나의 소셜 다이닝
            <IoIosArrowForward className="ml-2 text-[20px]" />
          </Link>
          <Link
            to={user ? '/myprofile/myprofileboard' : '#'}
            onClick={handleDeliciousDiscoveryClick}
            className="mt-2 flex h-[52px] w-[82%] items-center justify-start rounded-full text-[20px] font-bold text-black">
            <img
              src="/images/ProfileDeliciousFinder.svg"
              alt="Profile Delicious Finder"
              className="mr-2 h-[20px] w-[20px]"
            />
            나의 맛있는 발견
            <IoIosArrowForward className="ml-2 text-[20px]" />
          </Link>
          <Link
            to="/updatenote"
            className="mt-2 flex h-[52px] w-[82%] items-center justify-start rounded-full text-[20px] font-bold text-black">
            <PiNotebookLight className="mr-2 text-[20px]" />
            개발자 노트
            <IoIosArrowForward className="ml-2 text-[20px]" />
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Link
            to={'https://suist.notion.site/e2c6e050f097489fb620469d397f70d8'}
            target="_blank"
            className="mt-2 flex h-[52px] w-[82%] items-center justify-start rounded-full text-[20px] font-bold text-black">
            <PiFileDoc className="mr-2 text-[20px]" />
            이용약관
            <IoIosArrowForward className="ml-2 text-[20px]" />
          </Link>
          <div className="mt-8 flex h-[52px] w-[82%] items-center justify-start">
            <button
              onClick={() => window.open('https://pf.kakao.com/_xixaBxoG/chat', '_blank')}
              className="flex h-full w-[50%] items-center justify-start rounded-full text-[20px] font-bold">
              의견 보내기
            </button>
            <Link to={'/introduction'} className="flex h-full w-[50%] items-center justify-start text-[18px] font-bold">
              <button>밥피엔스란?</button>
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center p-[16px] xs:p-2">
          <button
            onClick={handleLogout}
            className={`w-[82%] rounded-xl border-2 border-orange-500 bg-orange-500 px-1 py-2 font-semibold text-white hover:border-orange-600 hover:bg-orange-600 ${!user ? 'hidden' : ''}`}>
            로그아웃
          </button>
        </div>
        <ModalCenter isOpen={isLoginPromptOpen} title1="로그인 후 내 입맛 설정이 가능합니다" onClose={closeLoginPrompt}>
          <p className="text-[#666666] xs:text-[14px]">로그인하시겠습니까?</p>
          <div className="mt-8 flex w-full gap-3">
            <button
              onClick={closeLoginPrompt}
              className="w-full rounded-xl border-2 border-orange-400 px-1 py-2 font-semibold text-orange-500 hover:bg-orange-50">
              취소
            </button>
            <button
              onClick={handleLoginRedirect}
              className="w-full rounded-xl border-2 border-orange-500 bg-orange-500 px-1 py-2 font-semibold text-white hover:border-orange-600 hover:bg-orange-600">
              로그인
            </button>
          </div>
        </ModalCenter>
        <ModalCenter
          isOpen={isSocialDiningPromptOpen}
          title1="로그인 후 나의 소셜 다이닝을 이용하실 수 있습니다."
          onClose={closeSocialDiningPrompt}>
          <p className="text-[#666666] xs:text-[14px]">로그인하시겠습니까?</p>
          <div className="mt-8 flex w-full gap-3">
            <button
              onClick={closeSocialDiningPrompt}
              className="w-full rounded-xl border-2 border-orange-400 px-1 py-2 font-semibold text-orange-500 hover:bg-orange-50">
              취소
            </button>
            <button
              onClick={handleLoginRedirect}
              className="w-full rounded-xl border-2 border-orange-500 bg-orange-500 px-1 py-2 font-semibold text-white hover:border-orange-600 hover:bg-orange-600">
              로그인
            </button>
          </div>
        </ModalCenter>
        <ModalCenter
          isOpen={isDeliciousDiscoveryPromptOpen}
          title1="로그인 후 나의 맛있는 발견을 이용하실 수 있습니다."
          onClose={closeDeliciousDiscoveryPrompt}>
          <p className="text-[#666666] xs:text-[14px]">로그인하시겠습니까?</p>
          <div className="mt-8 flex w-full gap-3">
            <button
              onClick={closeDeliciousDiscoveryPrompt}
              className="w-full rounded-xl border-2 border-orange-400 px-1 py-2 font-semibold text-orange-500 hover:bg-orange-50">
              취소
            </button>
            <button
              onClick={handleLoginRedirect}
              className="w-full rounded-xl border-2 border-orange-500 bg-orange-500 px-1 py-2 font-semibold text-white hover:border-orange-600 hover:bg-orange-600">
              로그인
            </button>
          </div>
        </ModalCenter>
      </motion.div>
    </div>,
    document.getElementById('modal-root')!,
  );
};

export default ModalRight;
