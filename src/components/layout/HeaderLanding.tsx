import { Link } from 'react-router-dom';

const HeaderLanding = () => {
  return (
    <div className="fixed z-50 mt-0 flex h-[72px] w-full max-w-[600px] items-center justify-center bg-white px-2 py-5 text-xl font-semibold xs:h-[52px]">
      <h1 className="flex w-full max-w-[600px] items-center justify-center">
        <Link to={'/'}>
          <img src="/images/babpiens_logo.svg" alt="Logo" className="h-full w-[150px]" />
        </Link>
      </h1>
    </div>
  );
};

export default HeaderLanding;
