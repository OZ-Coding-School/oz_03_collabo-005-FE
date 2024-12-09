import { Link } from 'react-router-dom';
import { TbMoodCheck } from 'react-icons/tb';
import { PiForkKnife } from 'react-icons/pi';
import { HiOutlineDocumentText } from 'react-icons/hi2';
import { PiMagnifyingGlassPlus } from 'react-icons/pi';
import { motion } from 'framer-motion';

interface FirstSectionProps {
  isVisible: boolean;
  setIsImageLoaded: (loaded: boolean) => void;
  spicy: number | null | undefined;
}

const FirstSection: React.FC<FirstSectionProps> = ({ isVisible, setIsImageLoaded, spicy }) => (
  <div className="relative mt-[50px] flex w-full flex-col">
    <div className="relative z-10 flex h-[200px] flex-col bg-[#f3c6aa] bg-gradient-to-r from-[#b89481] via-[#a98c7b] to-[#69564a] xs:h-[330px] xs:justify-center">
      <div className="mx-2 mt-10 w-full text-[24px] font-bold text-white md:ml-[120px] xs:ml-8 xs:mt-7 xs:text-[25px]">
        당신의 미각을 깨우는 맞춤형 메뉴, <div></div>색다른 설렘이 있는 곳<div>이곳은 밥피엔스입니다.</div>
      </div>
      <div className="mt-auto flex justify-between md:absolute md:bottom-0 md:left-[1000px]">
        <img
          src="/images/HomeMonkey.svg"
          alt="monkey"
          className={`${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} block h-[150px] transition-transform duration-1000 xs:h-[150px]`}
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>
    </div>
    <div className="relative z-10 mb-2 mt-2 flex h-[200px] w-full flex-col px-2 py-2 xs:h-[150px] xs:justify-center">
      <div className="mt-10 flex flex-row justify-center space-x-4 rounded-xl bg-white px-2 py-2 xs:mt-0">
        <div className="group flex flex-col items-center">
          <Link
            to="/fti"
            className="group/button flex h-[100px] w-[100px] flex-col items-center justify-center rounded-full border-2 bg-white px-4 py-2 font-bold text-black shadow-xl transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-yellow-500 hover:text-white hover:shadow-2xl active:scale-95 md:text-[20px] xs:h-[70px] xs:w-[70px] xs:px-3 xs:text-[14px]">
            <motion.div
              whileHover={{ scale: 1.2 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="group-hover/button:text-white">
              <HiOutlineDocumentText className="text-[50px] xs:text-[30px]" />
            </motion.div>
          </Link>
          <span className="relative mt-2 text-sm font-bold transition-colors duration-300 group-hover:text-yellow-700">
            FTI 검사하기
            <span className="absolute -bottom-1 left-0 h-[4px] w-0 bg-yellow-300 bg-opacity-20 transition-all duration-300 ease-out group-hover:w-full" />
            <span className="absolute -bottom-0 left-0 h-[5px] w-0 bg-yellow-400 bg-opacity-50 transition-all delay-75 duration-300 ease-out group-hover:w-full" />
          </span>
        </div>
        <div className="group flex flex-col items-center">
          <Link
            to={spicy ? '/foods' : '/flavor'}
            className="group/button flex h-[100px] w-[100px] flex-col items-center justify-center rounded-full border-2 bg-white px-4 py-2 font-bold text-black shadow-xl transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-500 hover:text-white hover:shadow-2xl active:scale-95 md:text-[20px] xs:h-[70px] xs:w-[70px] xs:px-3 xs:text-[14px]">
            <motion.div
              whileHover={{ scale: 1.2 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="group-hover/button:text-white">
              <TbMoodCheck className="text-[50px]" />
            </motion.div>
          </Link>
          <span className="relative mt-2 text-sm font-bold transition-colors duration-300 group-hover:text-blue-700">
            {spicy ? '음식 추천받기' : '입맛 설정하기'}
            <span className="absolute -bottom-1 left-0 h-[4px] w-0 bg-yellow-300 bg-opacity-20 transition-all duration-300 ease-out group-hover:w-full" />
            <span className="absolute -bottom-0 left-0 h-[5px] w-0 bg-yellow-400 bg-opacity-50 transition-all delay-75 duration-300 ease-out group-hover:w-full" />
          </span>
        </div>
        <div className="group flex flex-col items-center">
          <Link
            to="/thunder"
            className="hover-border-4 group flex h-[100px] w-[100px] flex-col items-center justify-center rounded-full border-2 bg-white px-4 py-2 font-bold text-black shadow-xl transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-green-500 hover:text-white hover:shadow-2xl active:scale-95 md:text-[20px] xs:h-[70px] xs:w-[70px] xs:px-3 xs:text-[14px]">
            <motion.div
              whileHover={{ scale: 1.2 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="group-hover/button:text-white">
              <PiForkKnife className="text-[50px]" />
            </motion.div>
          </Link>
          <span className="relative mt-2 text-sm font-bold transition-colors duration-300 group-hover:text-green-700">
            소셜 다이닝
            <span className="absolute -bottom-1 left-0 h-[4px] w-0 bg-yellow-300 bg-opacity-20 transition-all duration-300 ease-out group-hover:w-full" />
            <span className="absolute -bottom-0 left-0 h-[5px] w-0 bg-yellow-400 bg-opacity-50 transition-all delay-75 duration-300 ease-out group-hover:w-full" />
          </span>
        </div>
        <div className="group flex flex-col items-center">
          <Link
            to="/board"
            className="group flex h-[100px] w-[100px] flex-col items-center justify-center rounded-full border-2 bg-white px-4 py-4 font-bold text-black shadow-xl transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-lime-500 hover:text-white hover:shadow-2xl active:scale-95 md:text-[20px] xs:h-[70px] xs:w-[70px] xs:px-3 xs:text-[14px]">
            <motion.div
              whileHover={{ scale: 1.2 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="group-hover/button:text-white">
              <PiMagnifyingGlassPlus className="text-[50px]" />
            </motion.div>
          </Link>
          <span className="relative mt-2 text-sm font-bold transition-colors duration-300 group-hover:text-lime-700">
            맛있는 발견
            <span className="absolute -bottom-1 left-0 h-[4px] w-0 bg-yellow-300 bg-opacity-20 transition-all duration-300 ease-out group-hover:w-full" />
            <span className="absolute -bottom-0 left-0 h-[5px] w-0 bg-yellow-400 bg-opacity-50 transition-all delay-75 duration-300 ease-out group-hover:w-full" />
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default FirstSection;
