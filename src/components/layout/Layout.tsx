import { Outlet } from 'react-router-dom';
import Header from './Header';
import Nav from './Nav';

const Layout = () => {
  return (
    <div className="flex h-full flex-col justify-between">
      <Header />
      <div className="grow">
        <Outlet />
      </div>
      <Nav />
    </div>
  );
};

export default Layout;
