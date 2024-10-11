import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TbMoodCheck } from 'react-icons/tb';
import { RxArrowLeft } from 'react-icons/rx';
import ModalRight from '../common/ModalRight'; // ModalCenter 컴포넌트 import
import { authInstance } from '../../api/util/instance';
import { getCookie } from '../../utils/cookie';
import ContentLoader from 'react-content-loader'; // ContentLoader import

const HeaderLanding = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const [profileImage, setProfileImage] = useState('/images/anonymous_avatars.svg'); // 프로필 이미지 상태 추가
  const [isLoadingProfile, setIsLoadingProfile] = useState(true); // 프로필 로딩 상태 추가
  const location = useLocation();
  const navigate = useNavigate();
  const isFoodsPath = location.pathname === '/foods';
  const isThunderPath = location.pathname === '/thunder';
  const isBoardPath = location.pathname === '/board';
  const isLandingPage = location.pathname === '/';

  // 로그인 상태 감지
  const [isLoggedIn, setIsLoggedIn] = useState(!!getCookie('refresh'));

  const fetchUserProfile = async () => {
    if (isLoggedIn) {
      setIsLoadingProfile(true); // 프로필 로딩 시작
      try {
        const res = await authInstance.get('/api/profile');
        const { profile_image_url } = res.data;
        setProfileImage(profile_image_url || '/images/anonymous_avatars.svg');
      } catch (error) {
        console.error('Failed to fetch user profile', error);
        setProfileImage('/images/anonymous_avatars.svg');
      } finally {
        setIsLoadingProfile(false); // 프로필 로딩 종료
      }
    }
  };

  useEffect(() => {
    fetchUserProfile(); // 로그인 상태일 때 프로필 이미지 가져오기
  }, [isLoggedIn, profileImage]); // profileImage 추가

  useEffect(() => {
    const interval = setInterval(() => {
      const loggedIn = !!getCookie('refresh');
      setIsLoggedIn(loggedIn); // 로그인 상태 감지
    }, 5000); // 5초마다 로그인 상태 확인

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  const handleProfileClick = () => {
    setIsModalOpen(true); // 프로필 클릭 시 모달 열기
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  return (
    <div className="fixed z-50 mt-0 flex h-[72px] w-full max-w-[600px] flex-col items-center justify-between bg-white bg-opacity-80 px-2 py-5 text-xl font-semibold backdrop-blur-lg md:max-w-full xs:h-[52px] xs:justify-center">
      <h1 className="flex items-center md:h-full md:w-full md:justify-around">
        <div className="flex items-center">
          {/* 뒤로가기 버튼 스타일 정의 - 랜딩페이지에서는 hidden */}
          {!isLandingPage && (
            <button
              onClick={() => navigate(-1)}
              className="md:hidden xs:flex"
              style={{ position: 'absolute', left: '30px' }}>
              <RxArrowLeft size={25} className="xs:w-[20px]" />
            </button>
          )}
          <Link to={'/'}>
            <img src="/images/babpiens_logo.svg" alt="Logo" className="h-full w-[150px] md:ml-[80px]" />
          </Link>
        </div>
        <nav className="hidden space-x-12 md:ml-[120px] md:mr-auto md:flex">
          <Link
            to="foods"
            className={`rounded-xl px-2 py-2 text-black transition-transform duration-300 ease-in-out hover:scale-105 hover:border-black hover:bg-slate-200 active:scale-95 ${isFoodsPath ? 'bg-slate-200' : ''}`}>
            <TbMoodCheck className={`mr-2 inline-block h-7 w-7 ${isFoodsPath ? 'text-blue-500' : 'text-gray-500'}`} />
            개인별 음식추천
          </Link>
          <Link
            to="/thunder"
            className={`rounded-xl px-2 py-2 text-black transition-transform duration-300 ease-in-out hover:scale-105 hover:border-black hover:bg-slate-200 active:scale-95 ${isThunderPath ? 'bg-slate-200' : ''}`}>
            <img
              src={isThunderPath ? '/images/SocialDiningActive.svg' : '/images/SocialDining.svg'}
              alt="소셜 다이닝 아이콘"
              className="mr-2 inline-block h-7 w-7"
            />
            소셜 다이닝
          </Link>
          <Link
            to="/board"
            className={`rounded-xl px-2 py-2 text-black transition-transform duration-300 ease-in-out hover:scale-105 hover:border-black hover:bg-slate-200 active:scale-95 ${isBoardPath ? 'bg-slate-200' : ''}`}>
            <img
              src={isBoardPath ? '/images/DeliciousInFinder.svg' : '/images/DeliciousFinder.svg'}
              alt="맛있는 발견 아이콘"
              className="mr-2 inline-block h-7 w-7"
            />
            맛있는 발견
          </Link>
        </nav>
        <button onClick={handleProfileClick} className="hidden md:flex">
          {isLoggedIn ? ( // 로그인 상태에 따라 ContentLoader 또는 프로필 이미지 표시
            isLoadingProfile ? (
              <ContentLoader
                speed={2}
                width={40}
                height={40}
                viewBox="0 0 40 40"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb">
                <circle cx="20" cy="20" r="20" />
              </ContentLoader>
            ) : (
              <img
                src={profileImage}
                alt="Profile"
                className="h-10 w-10 rounded-full transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-md active:scale-95 md:mr-2"
              />
            )
          ) : (
            <img
              src="/images/anonymous_avatars.svg" // 로그인 상태가 아닐 때 대체 이미지
              alt="Anonymous"
              className="h-10 w-10 rounded-full"
            />
          )}
        </button>
      </h1>
      {isModalOpen && <ModalRight isOpen={isModalOpen} onClose={handleCloseModal} />} {/* 모달 컴포넌트 수정 */}
    </div>
  );
};

export default HeaderLanding;
