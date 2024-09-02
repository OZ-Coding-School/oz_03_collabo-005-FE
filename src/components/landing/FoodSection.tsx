import { Link } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';
import FoodsCarousel from './FoodsCarousel';
import { Dispatch, SetStateAction } from 'react';

interface FoodSectionProps {
  spicy: number | null;
  setConfirmFlavor: Dispatch<SetStateAction<boolean>>;
}

const FoodSection: React.FC<FoodSectionProps> = ({ spicy, setConfirmFlavor }) => {
  return (
    <div className="relative h-full w-full">
      <div className="flex items-center gap-5 p-4 pb-0">
        <h2 className="text-[24px] font-bold">오늘 뭐 먹지?</h2>
        <Link to={'/foods'} className="font-medium">
          더보기
        </Link>
      </div>
      <FoodsCarousel spicy={spicy} setConfirmFlavor={setConfirmFlavor} />
      {!spicy && (
        <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
          <div className="flex h-[40%] w-[80%] flex-col items-center justify-center rounded-lg bg-[#f5f5f5] p-6 xs:h-[50%]">
            <h3 className="mb-4 text-[20px] text-xl font-medium text-[#666666] xs:text-base">
              아직 입맛이 설정되지 않았습니다
            </h3>
            <Link to={'/flavor'}>
              <p className="flex items-center font-medium text-primary xs:text-[14px]">
                입맛 설정하고 추천받기 <IoIosArrowForward className="mt-[1px] text-[16px] xs:mt-0" />
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodSection;
