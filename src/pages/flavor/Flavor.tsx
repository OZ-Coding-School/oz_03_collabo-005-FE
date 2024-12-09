import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ModalCenter from '../../components/common/ModalCenter';
import { motion } from 'framer-motion';
import ContentLoader from 'react-content-loader';
import { getItem } from '../../utils/storage';
import { isTokenExpired, refreshAccessToken } from '../../api/util/instance';
import Button from '../../components/common/Button';
import BlurFade from '../../components/ui/blur-fade'; // BlurFade 컴포넌트 임포트 추가

const Flavor = () => {
  const navigate = useNavigate();
  const [isModalCenterOpen, setIsModalCenterOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const openModalCenter = () => setIsModalCenterOpen(true);
  const closeModalCenter = () => setIsModalCenterOpen(false);

  const checkToken = async () => {
    let token = getItem('access');
    if (!token || isTokenExpired(token)) {
      token = await refreshAccessToken('noErrorCode');
    }
    if (token) {
      navigate('/flavor/test');
    } else {
      openModalCenter();
    }
  };

  return (
    <div className="mt-[290px] flex h-[300px] flex-col items-center justify-center bg-white xs:mt-[150px]">
      <div className="relative w-full items-center md:max-w-[1200px]" />
      <div className="flex flex-col items-center">
        {!isImageLoaded && (
          <ContentLoader height={5} width={5} speed={2} backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
            <circle cx="10" cy="10" r="10" />
          </ContentLoader>
        )}
        <motion.img
          src="/images/CuteEgg.svg"
          alt="미각 DNA"
          className={`mt-[20px] flex w-[200px] drop-shadow-2xl xs:mt-[25px] ${isImageLoaded ? 'block' : 'hidden'}`}
          onLoad={() => setIsImageLoaded(true)}
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        <motion.div className="w-full text-[72px] font-semibold xs:mt-[20px] xs:text-[20px]">
          <BlurFade delay={0.2}>
            <span className="flex w-[500px] justify-center rounded-full bg-gradient-to-r from-blue-500 to-green-700 px-2 py-1 text-[25px] text-white xs:ml-[10px] xs:mr-[15px] xs:w-[380px] xs:justify-center xs:text-[20px]">
              # 나의 미각은 어떤 DNA를 가지고 있을까?
            </span>
          </BlurFade>
        </motion.div>
        <BlurFade delay={0.5}>
          <div className="flex text-[55px] font-bold xs:ml-[0px] xs:mt-2 xs:text-[20px]">
            당신의 미각 DNA를 찾아보세요
          </div>
        </BlurFade>
        <motion.div
          className="ml-2 mt-[16px] w-full text-[30px] xs:ml-0 xs:text-center xs:text-[15px]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}>
          당신의 미각은 얼마나 독특한가요? <br />
          맞춤형 음식 추천을 위한 첫 단계. 지금 시작하세요
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}>
          <Button
            onClick={checkToken}
            buttonSize="normal"
            bgColor="filled"
            className="mt-[100px] h-[65px] w-[300px] transform rounded-full shadow-lg transition duration-100 ease-in-out hover:bg-orange-600 active:bg-orange-700 xs:mt-[60px]">
            <span className="font-bold">테스트 하기</span>
          </Button>
        </motion.div>
        <motion.div
          className="mt-[40px] text-center xs:mt-[20px] xs:text-[13px]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}>
          테스트 결과에 따라 맞춤형 입맛 추천 메뉴가 제공됩니다.
        </motion.div>
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
        <div className="mt-8 flex w-full gap-4">
          <Button
            onClick={closeModalCenter}
            buttonSize="normal"
            bgColor="outline"
            className="w-full rounded-xl border-2 border-orange-400 px-1 py-2 font-semibold text-orange-500 hover:bg-orange-100">
            취소
          </Button>
          <Link to="/signin" className="w-full">
            <Button
              buttonSize="normal"
              bgColor="filled"
              className="w-full rounded-xl border-2 border-orange-500 bg-orange-500 px-1 py-2 font-semibold text-white hover:border-orange-600 hover:bg-orange-600">
              로그인
            </Button>
          </Link>
        </div>
      </ModalCenter>
    </div>
  );
};

export default Flavor;
