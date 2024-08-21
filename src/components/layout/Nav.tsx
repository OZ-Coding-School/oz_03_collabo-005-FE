import { useLocation, Link } from 'react-router-dom';

const Nav = () => {
  const location = useLocation();
  const isHomePath = location.pathname === '/';

  const isThunderPath = location.pathname === '/thunder'; // 입맛 설정하기
  const isFlavorPath = location.pathname === '/flavor'; // 소셜 다이닝

  const isBoardPath = location.pathname === '/board'; // 맛있는 발견

  const isMyProfilePath = location.pathname === '/myprofile'; // 프로필
  const isMyProfileEditPath = location.pathname === '/myprofile/myprofileedit'; // 프로필
  const isMyProfileThunder = location.pathname === '/myprofile/myprofilethunder'; // 프로필
  const isMyProfileBoard = location.pathname === '/myprofile/myprofileboard'; // 프로필

  const isSigninPath = location.pathname === '/signin'; // 로그인 페이지
  const isSignupPath = location.pathname === '/signup'; // 회원가입 페이지

  const isProfilePath = location.pathname.startsWith('/profile/'); // 프로필 페이지

  const isImgPath = location.pathname === '/image'; // 이미지 상세보기

  // Signin, Signup, Flavor, MyProfile 페이지에서는 Navbar가 보이지 않게 설정.
  if (
    isSigninPath ||
    isSignupPath ||
    isFlavorPath ||
    isMyProfileEditPath ||
    isMyProfileThunder ||
    isMyProfileBoard ||
    isProfilePath ||
    isImgPath
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-0 flex h-[75px] w-full max-w-[600px] items-center justify-between bg-white">
      <Link to="/" className="flex flex-col items-center justify-center text-center">
        <img className="mb-2 ml-10" src={isHomePath ? '/images/Home.svg' : '/images/HomeInactive.svg'} alt="홈" />
        <span className={`ml-10 text-center font-medium ${isHomePath ? 'text-orange-800' : 'text-gray-400'}`}>홈</span>
      </Link>

      <Link to="/thunder" className="flex flex-col items-center justify-center text-center">
        <img
          className="mb-2"
          src={isThunderPath ? '/images/SocialDiningActive.svg' : '/images/SocialDining.svg'}
          alt="소셜 다이닝"
        />

        <span className={`text-center font-medium ${isThunderPath ? 'text-orange-800' : 'text-gray-400'}`}>
          소셜 다이닝
        </span>
      </Link>

      <Link to="/board" className="flex flex-col items-center justify-center text-center">
        <img
          className="mb-2"
          src={isBoardPath ? '/images/DeliciousInFinder.svg' : '/images/DeliciousFinder.svg'}
          alt="맛있는 발견"
        />
        <span className={`text-center font-medium ${isBoardPath ? 'text-orange-800' : 'text-gray-400'}`}>
          맛있는 발견
        </span>
      </Link>

      <Link to="/myprofile" className="flex flex-col items-center justify-center text-center">
        <img
          className="mb-2 mr-10"
          src={isMyProfilePath ? '/images/ProfileActive.svg' : '/images/ProfileInactive.svg'}
          alt="프로필"
        />
        <span className={`mr-10 text-center font-medium ${isMyProfilePath ? 'text-orange-800' : 'text-gray-400'}`}>
          프로필
        </span>
      </Link>
    </div>
  );
};

export default Nav;
