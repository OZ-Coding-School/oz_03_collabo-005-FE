import { useLocation, useNavigate } from 'react-router-dom';
import { RxArrowLeft } from 'react-icons/rx';
import HeaderLanding from './HeaderLanding';
import { useFoodStore } from '../../store/foodStore/foodStore';

const Header = () => {
  const foodName = useFoodStore((state) => state.foodName);
  const location = useLocation();
  const navigate = useNavigate();

  const isLandingPage = location.pathname === '/';

  const isFlavorPage = location.pathname === '/flavor';
  const isFlavorTestPage = location.pathname === '/flavor/test';
  const isFoodsPage = location.pathname === '/foods';
  const isFoodsPageId = location.pathname.startsWith('/foods/');
  const isFtiPage = location.pathname === '/FTI';

  const isThunderPage = location.pathname === '/thunder';
  const isThunderDetailPage = location.pathname.includes('/thunder');
  const isThunderPostPage = location.pathname.includes('/thunder/thunderpost');
  const isThunderChatPage = location.pathname.includes('/thunder/thunderchat');
  const isBoardPage = location.pathname === '/board';
  const isBoardDetailPage = location.pathname.includes('/board');

  const isSigninPage = location.pathname === '/signin';
  const isSignupPage = location.pathname === '/signup';
  const isResetPasswordPage = location.pathname === '/signin/resetpassword';

  const isMyProfilePage = location.pathname === '/myprofile/myprofileedit';
  const isMyProfileBoardPage = location.pathname === '/myprofile/myprofileboard';
  const isMyProfileThunderPage = location.pathname === '/myprofile/myprofilethunder';

  const isProfilePath = location.pathname.startsWith('/profile/');

  const isImgPath = location.pathname === '/image';

  const isIntroductionPath = location.pathname === '/introduction';

  // 페이지에 따른 타이틀 변경.
  const changeTitle = () => {
    if (isFlavorPage) return '미각 DNA 검사';
    if (isFlavorTestPage) return '미각 DNA 검사';
    if (isFoodsPage) return '개인별 음식 추천';
    if (isFoodsPageId) return `내주변 ${foodName}`;
    if (isThunderPage) return '소셜 다이닝';
    if (isThunderDetailPage) return '소셜 다이닝';
    if (isThunderPostPage) return '소셜 다이닝';
    if (isThunderChatPage) return '소통방';
    if (isFtiPage) return 'FTI 검사';
    if (isBoardPage) return '맛있는 발견';
    if (isBoardDetailPage) return '맛있는 발견';

    if (isSigninPage) return '로그인';
    if (isSignupPage) return '회원가입';
    if (isResetPasswordPage) return '비밀번호를 잊어버렸어요';

    if (isMyProfilePage) return '프로필 수정';
    if (isMyProfileBoardPage) return '나의 맛있는 발견';
    if (isMyProfileThunderPage) return '나의 소셜 다이닝';

    if (isProfilePath) return '프로필 ';

    if (isImgPath) return '이미지 상세보기';

    if (isIntroductionPath) return '밥피엔스란';
  };

  if (isLandingPage) {
    return <HeaderLanding />;
  }

  return (
    <div className="fixed z-50 mt-0 flex h-[72px] w-full max-w-[600px] items-center bg-white px-4 py-5 text-xl font-semibold xs:h-[52px] xs:pl-[10px]">
      {/* 뒤로가기 버튼 활성화되어야 할 페이지
      MyProfile, Foods, Flavor, Fti, Thunder, ThunderChat, Board, Signin, Signup, ResetPassword, MyProfileThunder, MyProfileBoard */}
      <div className="flex w-full items-center justify-center">
        {(isMyProfilePage ||
          isFoodsPage ||
          isFoodsPageId ||
          isFlavorPage ||
          isFtiPage ||
          isThunderPage ||
          isThunderDetailPage ||
          isThunderPostPage ||
          isThunderChatPage ||
          isBoardPage ||
          isBoardDetailPage ||
          isSigninPage ||
          isSignupPage ||
          isResetPasswordPage ||
          isMyProfileThunderPage ||
          isMyProfileBoardPage ||
          isProfilePath ||
          isImgPath ||
          isFlavorTestPage ||
          isIntroductionPath) && (
          <button onClick={() => navigate(-1)} className="flex items-center">
            <RxArrowLeft size={25} className="xs:w-[20px]" />
          </button>
        )}

        <div className={`flex-1 ${isLandingPage ? 'text-right' : 'ml-[20px]'} xs:ml-[10px] xs:text-[16px]`}>
          {changeTitle()}
        </div>
      </div>
    </div>
  );
};

export default Header;
