import HeaderLanding from '../../components/layout/HeaderLanding';

const NotFound = () => {
  return (
    <>
      <div className="fixed top-0 z-50">
        <HeaderLanding />
      </div>
      <div className="flex h-full w-full flex-col items-center justify-center pb-[75px] xs:pb-[65px]">
        <img src="/images/404.svg" className="h-[300px] w-full"></img>
        <p className="my-10 text-[20px] font-bold">요청하신 페이지를 찾을 수 없습니다.</p>
        <p className="mb-10 px-5 text-center text-[16px] font-medium text-[#666666]">
          존재하지 않는 주소를 입력하셨거나 <br /> 요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.
        </p>
      </div>
    </>
  );
};

export default NotFound;
