import { Outlet } from 'react-router-dom';
import Header from './Header';
import Nav from './Nav';

const Layout = () => {
  return (
    <div className="mx-auto flex h-full max-w-[600px] flex-col justify-between">
      <Header />
      <div className="mt-[72px] grow">
        <Outlet />
      </div>
      <Nav />
    </div>
  );
};

export default Layout;
