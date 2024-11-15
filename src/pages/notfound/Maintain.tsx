import HeaderLanding from '../../components/layout/HeaderLanding';
import { BiSolidWrench } from 'react-icons/bi';

const Maintain = () => {
  return (
    <>
      <div className="fixed top-0 z-50">
        <HeaderLanding />
      </div>
      <div className="flex h-full w-full flex-col items-center justify-center pb-[75px] xs:pb-[65px]">
        <BiSolidWrench className="mb-5 rounded-xl text-[80px] text-orange-500 shadow-xl" />
        <p className="text-[20px] font-bold">현재 서버점검 중입니다.</p>
        <p className="mt-[20px] px-5 text-center text-[16px] font-medium text-[#666666] xs:text-[13px]">
          서버점검 시간이 지나고 다시 이용해주시기 바랍니다.
        </p>
        <p className="mb-10 px-5 text-center text-[16px] font-medium text-[#666666] xs:text-[13px]">
          -밥피엔스 개발팀-
        </p>
      </div>
    </>
  );
};

export default Maintain;
