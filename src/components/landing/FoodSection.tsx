import { Link } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';
import { MdRestaurantMenu } from 'react-icons/md';
import FoodsCarousel from './FoodsCarousel';

interface FoodSectionProps {
  spicy: number | null;
}

const FoodSection: React.FC<FoodSectionProps> = ({ spicy }) => {
  return (
    <div className="relative h-full w-full">
      <div className="flex items-center gap-5 p-4 pb-0">
        <h2 className="flex items-center text-[24px] font-bold">
          <MdRestaurantMenu className="mr-2" />
          <span className="relative">
            오늘 뭐 먹지?
            <span className="absolute bottom-0 left-0 h-[6px] w-full bg-yellow-300 opacity-50" />
            <span className="absolute bottom-[-4px] left-0 h-[2px] w-full bg-yellow-400" />
          </span>
        </h2>
        <Link
          to={'/foods'}
          className="flex w-[100px] items-center justify-center rounded-full border-2 px-2 py-2 font-medium hover:bg-green-500 hover:text-white">
          더보기 <IoIosArrowForward className="ml-1" />
        </Link>
      </div>
      <FoodsCarousel spicy={spicy} />
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
