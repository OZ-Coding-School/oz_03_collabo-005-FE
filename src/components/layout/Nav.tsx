import { useLocation, Link } from 'react-router-dom';

const Nav = () => {
  const location = useLocation();
  const isHomePath = location.pathname === '/';

  const isThunderPath = location.pathname === '/Thunder'; // 입맛 설정하기
  const isFlavorPath = location.pathname === '/Flavor'; // 소셜 다이닝

  const isBoardPath = location.pathname === '/Board'; // 맛있는 발견
  const isMyProfilePath = location.pathname === '/MyProfile'; // 프로필
  const isSigninPath = location.pathname === '/Signin'; // 로그인 페이지
  const isSignupPath = location.pathname === '/signup'; // 회원가입 페이지

  // Signin, Signup, Flavor 페이지에서는 Navbar가 보이지 않게 설정.
  if (isSigninPath || isSignupPath || isFlavorPath) {
    return null;
  }

  return (
    <div className="fixed bottom-0 flex h-[75px] w-full max-w-[600px] items-center justify-between bg-white">
      <Link to="/" className="flex flex-col items-center justify-center text-center">
        <img className="mb-2 ml-10" src="/images/Home.svg" alt="홈" />
        <span className={`ml-10 text-center font-medium ${isHomePath ? 'text-orange-800' : 'text-gray-400'}`}>홈</span>
      </Link>

      <Link to="/Thunder" className="flex flex-col items-center justify-center text-center">
        <img
          className="mb-2"
          src={isThunderPath ? '/images/SocialDiningActive.svg' : '/images/SocialDining.svg'}
          alt="소셜 다이닝"
        />

        <span className={`text-center font-medium ${isThunderPath ? 'text-orange-800' : 'text-gray-400'}`}>
          소셜 다이닝
        </span>
      </Link>

      <Link to="/Board" className="flex flex-col items-center justify-center text-center">
        <img
          className="mb-2"
          src={isBoardPath ? '/images/DeliciousFinder.svg' : '/images/DeliciousFinder.svg'}
          alt="맛있는 발견"
        />
        <span className={`text-center font-medium ${isBoardPath ? 'text-orange-800' : 'text-gray-400'}`}>
          맛있는 발견
        </span>
      </Link>

      <Link to="/MyProfile" className="flex flex-col items-center justify-center text-center">
        <img
          className="mb-2 mr-10"
          src={isMyProfilePath ? '/images/ProfileActive.svg' : '/images/Profile.svg'}
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
