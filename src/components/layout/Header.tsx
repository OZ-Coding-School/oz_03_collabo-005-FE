import { useLocation, Link } from 'react-router-dom';
import { RxArrowLeft } from 'react-icons/rx';
import HeaderLanding from './HeaderLanding';

const Header = () => {
  const location = useLocation();

  const isLandingPage = location.pathname === '/';

  const isFlavorPage = location.pathname === '/flavor';
  const isFlavorTestPage = location.pathname === '/flavor/test';
  const isFoodsPage = location.pathname === '/foods';
  const isFtiPage = location.pathname === '/FTI';

  const isThunderPage = location.pathname === '/thunder';
  const isBoardPage = location.pathname === '/board';

  const isSigninPage = location.pathname === '/signin';
  const isSignupPage = location.pathname === '/signup';
  const isResetPasswordPage = location.pathname === '/signin/resetpassword';

  const isMyProfilePage = location.pathname === '/myprofile/myprofileedit';
  const isMyProfileBoardPage = location.pathname === '/myprofile/myprofileboard';
  const isMyProfileThunderPage = location.pathname === '/myprofile/myprofilethunder';

  // 페이지에 따른 타이틀 변경.
  const changeTitle = () => {
    if (isFlavorPage) return '미각 DNA 검사';
    if (isFlavorTestPage) return '미각 DNA 검사';
    if (isFoodsPage) return '개인별 음식 추천';
    if (isThunderPage) return '소셜 다이닝';
    if (isFtiPage) return 'FTI 검사';
    if (isBoardPage) return '맛있는 발견';

    if (isSigninPage) return '로그인';
    if (isSignupPage) return '회원가입';
    if (isResetPasswordPage) return '비밀번호를 잊어버렸어요';

    if (isMyProfilePage) return '프로필 수정';
    if (isMyProfileBoardPage) return '나의 맛있는 발견';
    if (isMyProfileThunderPage) return '나의 소셜 다이닝';
  };

  if (isLandingPage) {
    return <HeaderLanding />;
  }

  return (
    <div className="fixed z-50 mt-0 flex h-[72px] w-full max-w-[600px] items-center bg-white px-2 py-5 text-xl font-semibold">
      {/* 뒤로가기 버튼 활성화되어야 할 페이지
      MyProfile, Foods, Flavor, Fti, Thunder, Board, Signin, Signup, ResetPassword, MyProfileThunder, MyProfileBoard */}
      <div className="flex w-full items-center justify-center">
        {(isMyProfilePage ||
          isFoodsPage ||
          isFlavorPage ||
          isFtiPage ||
          isThunderPage ||
          isBoardPage ||
          isSigninPage ||
          isSignupPage ||
          isResetPasswordPage ||
          isMyProfileThunderPage ||
          isMyProfileBoardPage) && (
          <Link to="/" className="flex items-center">
            <RxArrowLeft size={25} />
          </Link>
        )}

        <div className={`flex-1 ${isLandingPage ? 'text-right' : 'ml-[20px]'}`}>{changeTitle()}</div>
      </div>
    </div>
  );
};

export default Header;
