import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Nav from './Nav';
import { useEffect } from 'react';

const Layout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.getElementById('root')?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="mx-auto flex h-full max-w-[600px] flex-col justify-between">
      <Header />
      <div className="mt-[72px] grow xs:mt-[52px]">
        <Outlet />
      </div>
      <Nav />
    </div>
  );
};

export default Layout;
