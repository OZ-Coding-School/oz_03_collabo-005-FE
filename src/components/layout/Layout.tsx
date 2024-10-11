import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Nav from './Nav';
import { useEffect } from 'react';

const Layout = () => {
  const { pathname } = useLocation();
  const isUpdateNotePath = pathname === '/updatenote';
  const isLandingPagePath = pathname === '/';
  const isThunderPagePath = pathname === '/thunder';
  const isThunderDetailPagePath = pathname.startsWith('/thunder/');
  const isBoardPagePath = pathname === '/board';
  const isBoardDetailPagePath = pathname.startsWith('/board/');
  const isMyProfilePagePath = pathname === '/myprofile';
  const isFoodsPagePath = pathname === '/foods';
  const isFtiPagePath = pathname === '/fti';
  const isSigninPagePath = pathname === '/signin';
  const isFlavorPagePath = pathname === '/flavor';

  useEffect(() => {
    document.getElementById('root')?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div
      className={`mx-auto flex h-full max-w-[600px] flex-col justify-between ${isUpdateNotePath ? 'mx-auto flex h-full max-w-[800px] flex-col justify-between backdrop-blur-xl' : ''} ${isLandingPagePath ? 'md:max-w-full' : ''} ${isThunderPagePath ? 'md:max-w-full' : ''} ${isThunderDetailPagePath ? 'md:max-w-full' : ''} ${isBoardPagePath ? 'md:max-w-full' : ''} ${isBoardDetailPagePath ? 'md:max-w-full' : ''} ${isMyProfilePagePath ? 'md:max-w-full' : ''} ${isFoodsPagePath ? 'md:max-w-full' : ''} ${isFtiPagePath ? 'md:max-w-full' : ''} ${isSigninPagePath ? 'md:max-w-full' : ''} ${isFlavorPagePath ? 'md:max-w-full' : ''}`}>
      <Header />
      <div className="mt-[72px] grow xs:mt-[52px]">
        <Outlet />
      </div>
      <Nav />
    </div>
  );
};

export default Layout;
