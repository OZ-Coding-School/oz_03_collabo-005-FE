import { useLocation, Link } from 'react-router-dom';

const Nav = () => {
  const location = useLocation();
  const isHomePath = location.pathname === '/';

  const isThunderPath = location.pathname === '/thunder'; // 소셜 다이닝 게시글 목록
  const isThunderPostPath = location.pathname.startsWith('/thunder/'); // 소셜 다이닝 게시글 상세
  const isFlavorPath = location.pathname === '/flavor'; // 입맛 검사
  const isFlavorTestPage = location.pathname === '/flavor/test';

  const isBoardPath = location.pathname === '/board'; // 맛있는 발견
  const isBoardPostPath = location.pathname.startsWith('/board/'); // 소셜 다이닝

  const isMyProfilePath = location.pathname === '/myprofile'; // 프로필
  const isMyProfileEditPath = location.pathname === '/myprofile/myprofileedit'; // 프로필
  const isMyProfileThunder = location.pathname === '/myprofile/myprofilethunder'; // 프로필
  const isMyProfileBoard = location.pathname === '/myprofile/myprofileboard'; // 프로필

  const isSigninPath = location.pathname === '/signin'; // 로그인 페이지
  const isSignupPath = location.pathname === '/signup'; // 회원가입 페이지

  const isProfilePath = location.pathname.startsWith('/profile/'); // 프로필 페이지

  const isImgPath = location.pathname === '/image'; // 이미지 상세보기

  // Signin, Signup, Flavor, ThunderPost, MyProfile 페이지에서는 Navbar가 보이지 않게 설정.
  if (
    isSigninPath ||
    isSignupPath ||
    isFlavorPath ||
    isThunderPostPath ||
    isBoardPostPath ||
    isMyProfileEditPath ||
    isMyProfileThunder ||
    isMyProfileBoard ||
    isProfilePath ||
    isImgPath ||
    isFlavorTestPage
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-0 z-50 flex h-[75px] w-full max-w-[600px] justify-around bg-white xs:h-[65px]">
      <Link to="/" className="flex w-1/4 flex-col items-center justify-center text-center xs:gap-2">
        <img
          className="mb-2 h-[19px] w-[19px] xs:mb-0 xs:w-[14px]"
          src={isHomePath ? '/images/Home.svg' : '/images/HomeInactive.svg'}
          alt="홈"
        />
        <span className={`text-center font-medium ${isHomePath ? 'text-orange-800' : 'text-gray-400'} xs:text-[14px]`}>
          홈
        </span>
      </Link>

      <Link to="/thunder" className="flex w-1/4 flex-col items-center justify-center text-center xs:gap-2">
        <img
          className="mb-2 h-[19px] w-[19px] xs:mb-0 xs:w-[14px]"
          src={isThunderPath ? '/images/SocialDiningActive.svg' : '/images/SocialDining.svg'}
          alt="소셜 다이닝"
        />
        <span
          className={`text-center font-medium ${isThunderPath ? 'text-orange-800' : 'text-gray-400'} xs:text-[14px]`}>
          소셜 다이닝
        </span>
      </Link>

      <Link to="/board" className="flex w-1/4 flex-col items-center justify-center text-center xs:gap-2">
        <img
          className="mb-2 h-[19px] w-[19px] xs:mb-0 xs:w-[14px]"
          src={isBoardPath ? '/images/DeliciousInFinder.svg' : '/images/DeliciousFinder.svg'}
          alt="맛있는 발견"
        />
        <span className={`text-center font-medium ${isBoardPath ? 'text-orange-800' : 'text-gray-400'} xs:text-[14px]`}>
          맛있는 발견
        </span>
      </Link>

      <Link to="/myprofile" className="flex w-1/4 flex-col items-center justify-center text-center xs:gap-2">
        <img
          className="mb-2 h-[19px] w-[19px] xs:mb-0 xs:w-[14px]"
          src={isMyProfilePath ? '/images/ProfileActive.svg' : '/images/ProfileInactive.svg'}
          alt="프로필"
        />
        <span
          className={`text-center font-medium ${isMyProfilePath ? 'text-orange-800' : 'text-gray-400'} xs:text-[14px]`}>
          프로필
        </span>
      </Link>
    </div>
  );
};

export default Nav;
