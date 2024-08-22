import { useState } from 'react';
import { Link } from 'react-router-dom';
import ModalCenter from '../../components/common/ModalCenter';
import { motion } from 'framer-motion';
import ContentLoader from 'react-content-loader';

const Flavor = () => {
  const [isModalCenterOpen, setIsModalCenterOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const openModalCenter = () => setIsModalCenterOpen(true);
  const closeModalCenter = () => setIsModalCenterOpen(false);

  return (
    <div className="mt-[100px] flex h-[300px] flex-col items-center justify-center bg-white">
      <div className="w-full items-center" />
      <div className="mt-5 flex flex-col items-center">
        {!isImageLoaded && (
          <ContentLoader height={5} width={5} speed={2} backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
            <circle cx="10" cy="10" r="10" />
          </ContentLoader>
        )}
        <motion.img
          src="/images/CuteEgg.svg"
          alt="미각 DNA"
          className={`flex ${isImageLoaded ? 'block' : 'hidden'}`}
          onLoad={() => setIsImageLoaded(true)}
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        <h2 className="mt-8 text-xl font-semibold">당신의 미각 DNA를 찾아보세요</h2>
        <p className="mt-4 text-center text-gray-500">
          당신의 미각은 얼마나 독특한가요?
          <br />
          맞춤형 음식 추천을 위한 첫 단계. 지금 시작하세요
        </p>
        <motion.button
          onClick={openModalCenter}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          className="mt-8 h-full w-[500px] rounded-xl bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600 xs:w-[350px]">
          시작하기
        </motion.button>
      </div>
      <ModalCenter
        isOpen={isModalCenterOpen}
        onClose={closeModalCenter}
        title1="맛있는 여정을 계속하시려면"
        title2="로그인이 필요해요.">
        <p>
          입맛 정보를 저장하고 <br />
          맞춤형 추천을 받으실 수 있습니다
        </p>
        <div className="mt-8 flex w-full space-x-4">
          <motion.button
            onClick={closeModalCenter}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            className="w-full flex-1 rounded-xl border-2 border-orange-400 px-1 py-2 font-semibold text-orange-500 hover:bg-orange-50">
            취소
          </motion.button>
          <Link to="/signin" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              className="w-full rounded-xl bg-orange-500 px-2 py-3 font-semibold text-white hover:bg-orange-600">
              로그인
            </motion.button>
          </Link>
        </div>
      </ModalCenter>
    </div>
  );
};

export default Flavor;
