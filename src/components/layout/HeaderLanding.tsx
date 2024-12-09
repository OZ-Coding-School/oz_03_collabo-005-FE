import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TbMoodCheck } from 'react-icons/tb';
import { RxArrowLeft } from 'react-icons/rx';
import { HiOutlineDocumentText } from 'react-icons/hi2';
import { PiForkKnife } from 'react-icons/pi';
import { PiMagnifyingGlassPlus } from 'react-icons/pi';
import { motion } from 'framer-motion';
import ModalRight from '../common/ModalRight';
import { authInstance } from '../../api/util/instance';
import { getCookie } from '../../utils/cookie';
import ContentLoader from 'react-content-loader';

const HeaderLanding = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState('/images/anonymous_avatars.svg');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [nickname, setNickname] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const isFoodsPath = location.pathname === '/foods';
  const isThunderPath = location.pathname === '/thunder';
  const isBoardPath = location.pathname === '/board';
  const isLandingPage = location.pathname === '/';
  const isFtiPath = location.pathname === '/fti';

  const [isLoggedIn, setIsLoggedIn] = useState(!!getCookie('refresh'));

  const fetchUserProfile = async () => {
    if (isLoggedIn) {
      setIsLoadingProfile(true);
      try {
        const res = await authInstance.get('/api/profile');
        const { profile_image_url, nickname: userNickname } = res.data;
        setProfileImage(profile_image_url || '/images/anonymous_avatars.svg');
        setNickname(userNickname || '');
      } catch (error) {
        console.error('Failed to fetch user profile', error);
        setProfileImage('/images/anonymous_avatars.svg');
        setNickname('');
      } finally {
        setIsLoadingProfile(false);
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const loggedIn = !!getCookie('refresh');
      if (loggedIn !== isLoggedIn) {
        setIsLoggedIn(loggedIn);
        if (loggedIn) {
          fetchUserProfile();
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleProfileClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="fixed z-50 mt-0 flex h-[150px] w-full max-w-[600px] flex-col items-center justify-between bg-white bg-opacity-80 px-2 py-5 text-xl font-semibold backdrop-blur-lg md:max-w-full xs:h-[52px] xs:justify-center">
      <h1 className="flex items-center md:h-full md:w-full md:justify-around">
        <div className="flex items-center">
          {!isLandingPage && (
            <button
              onClick={() => navigate(-1)}
              className="md:hidden xs:flex"
              style={{ position: 'absolute', left: '30px' }}>
              <RxArrowLeft size={25} className="xs:w-[20px]" />
            </button>
          )}
          <Link to={'/'}>
            <img src="/images/babpiens_logo.svg" alt="Logo" className="mx-auto w-[150px] md:h-full" />
          </Link>
        </div>
        <nav className={`mt-[10px] hidden space-x-12 ${isLandingPage ? 'md:hidden' : 'md:flex'}`}>
          <div className="group flex flex-col items-center">
            <Link
              to="/fti"
              className={`group/button flex h-[50px] w-[50px] flex-col items-center justify-center rounded-full border-2 ${
                isFtiPath ? 'bg-yellow-500 text-white' : 'bg-white text-black'
              } px-2 py-2 font-bold shadow-xl transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-yellow-500 hover:text-white hover:shadow-2xl active:scale-95`}>
              <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group-hover/button:text-white">
                <HiOutlineDocumentText className="text-[30px]" />
              </motion.div>
            </Link>
            <span
              className={`relative mt-2 text-sm font-bold transition-colors duration-300 ${isFtiPath ? 'text-yellow-700' : 'group-hover:text-yellow-700'}`}>
              FTI 검사하기
              <span className="absolute -bottom-1 left-0 h-[4px] w-0 bg-yellow-300 bg-opacity-20 transition-all duration-300 ease-out group-hover:w-full" />
              <span className="absolute -bottom-0 left-0 h-[5px] w-0 bg-yellow-400 bg-opacity-50 transition-all delay-75 duration-300 ease-out group-hover:w-full" />
            </span>
          </div>

          <div className="group flex flex-col items-center">
            <Link
              to="/foods"
              className={`group/button flex h-[50px] w-[50px] flex-col items-center justify-center rounded-full border-2 ${
                isFoodsPath ? 'bg-blue-500 text-white' : 'bg-white text-black'
              } px-2 py-2 font-bold shadow-xl transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-500 hover:text-white hover:shadow-2xl active:scale-95`}>
              <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group-hover/button:text-white">
                <TbMoodCheck className="text-[30px]" />
              </motion.div>
            </Link>
            <span
              className={`relative mt-2 text-sm font-bold transition-colors duration-300 ${isFoodsPath ? 'text-blue-700' : 'group-hover:text-blue-700'}`}>
              음식 추천받기
              <span className="absolute -bottom-1 left-0 h-[4px] w-0 bg-yellow-300 bg-opacity-20 transition-all duration-300 ease-out group-hover:w-full" />
              <span className="absolute -bottom-0 left-0 h-[5px] w-0 bg-yellow-400 bg-opacity-50 transition-all delay-75 duration-300 ease-out group-hover:w-full" />
            </span>
          </div>

          <div className="group flex flex-col items-center">
            <Link
              to="/thunder"
              className={`group/button flex h-[50px] w-[50px] flex-col items-center justify-center rounded-full border-2 ${
                isThunderPath ? 'bg-green-500 text-white' : 'bg-white text-black'
              } px-2 py-2 font-bold shadow-xl transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-green-500 hover:text-white hover:shadow-2xl active:scale-95`}>
              <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group-hover/button:text-white">
                <PiForkKnife className="text-[30px]" />
              </motion.div>
            </Link>
            <span
              className={`relative mt-2 text-sm font-bold transition-colors duration-300 ${isThunderPath ? 'text-green-700' : 'group-hover:text-green-700'}`}>
              소셜 다이닝
              <span className="absolute -bottom-1 left-0 h-[4px] w-0 bg-yellow-300 bg-opacity-20 transition-all duration-300 ease-out group-hover:w-full" />
              <span className="absolute -bottom-0 left-0 h-[5px] w-0 bg-yellow-400 bg-opacity-50 transition-all delay-75 duration-300 ease-out group-hover:w-full" />
            </span>
          </div>

          <div className="group flex flex-col items-center">
            <Link
              to="/board"
              className={`group/button flex h-[50px] w-[50px] flex-col items-center justify-center rounded-full border-2 ${
                isBoardPath ? 'bg-lime-500 text-white' : 'bg-white text-black'
              } px-2 py-2 font-bold shadow-xl transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-lime-500 hover:text-white hover:shadow-2xl active:scale-95`}>
              <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group-hover/button:text-white">
                <PiMagnifyingGlassPlus className="text-[30px]" />
              </motion.div>
            </Link>
            <span
              className={`relative mt-2 text-sm font-bold transition-colors duration-300 ${isBoardPath ? 'text-lime-700' : 'group-hover:text-lime-700'}`}>
              맛있는 발견
              <span className="absolute -bottom-1 left-0 h-[4px] w-0 bg-yellow-300 bg-opacity-20 transition-all duration-300 ease-out group-hover:w-full" />
              <span className="absolute -bottom-0 left-0 h-[5px] w-0 bg-yellow-400 bg-opacity-50 transition-all delay-75 duration-300 ease-out group-hover:w-full" />
            </span>
          </div>
        </nav>
        <button onClick={handleProfileClick} className="hidden items-center md:flex">
          {isLoggedIn ? (
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
              <div className="flex items-center">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="mb-[50px] h-10 w-10 rounded-full transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-md active:scale-95 md:mr-2"
                />
                {nickname && (
                  <div className="flex flex-col items-start">
                    <span className="ml-2 text-left text-[20px]">
                      <span className="text-[22px] font-bold">{nickname}</span>님 반가워요!
                    </span>
                    <span className="ml-2 text-left text-[16px] text-gray-600">
                      오늘도 밥피엔스와 함께 기분좋은 식사 되세요!
                    </span>
                    <div className="mt-2 flex items-center">
                      <div className="group flex items-center">
                        <Link
                          to="/myprofile/myprofilethunder"
                          className="relative ml-2 mt-2 text-sm font-bold transition-colors duration-300 group-hover:text-green-700">
                          나의 소셜 다이닝
                          <span className="absolute -bottom-1 left-0 h-[4px] w-0 bg-yellow-300 bg-opacity-20 transition-all duration-300 ease-out group-hover:w-full" />
                          <span className="absolute -bottom-0 left-0 h-[5px] w-0 bg-yellow-400 bg-opacity-50 transition-all delay-75 duration-300 ease-out group-hover:w-full" />
                        </Link>
                      </div>
                      <div className="mx-4 mt-2 h-4 w-px bg-gray-300" />
                      <div className="group flex items-center">
                        <Link
                          to="/myprofile/myprofileboard"
                          className={`relative mt-2 text-sm font-bold transition-colors duration-300 ${isThunderPath ? 'text-green-700' : 'group-hover:text-green-700'}`}>
                          나의 맛있는 발견
                          <span className="absolute -bottom-1 left-0 h-[4px] w-0 bg-yellow-300 bg-opacity-20 transition-all duration-300 ease-out group-hover:w-full" />
                          <span className="absolute -bottom-0 left-0 h-[5px] w-0 bg-yellow-400 bg-opacity-50 transition-all delay-75 duration-300 ease-out group-hover:w-full" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          ) : (
            <img src="/images/anonymous_avatars.svg" alt="Anonymous" className="h-10 w-10 rounded-full" />
          )}
        </button>
      </h1>
      {isModalOpen && <ModalRight isOpen={isModalOpen} onClose={handleCloseModal} />}
    </div>
  );
};

export default HeaderLanding;
