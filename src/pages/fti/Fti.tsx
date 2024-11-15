import { useNavigate } from 'react-router-dom';
import { RainbowButton } from '../../components/ui/rainbow-button'; // RainbowButton 임포트 추가
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getFtiTestCount } from '../../api/apis/fti'; // getFtiTestCount 함수 임포트 경로 수정
import NumberTicker from '../../components/ui/number-ticker'; // NumberTicker 임포트 추가
import BlurFade from '../../components/ui/blur-fade'; // BlurFade 컴포넌트 임포트 추가

const Fti = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [showElements, setShowElements] = useState(true);
  const [testCount, setTestCount] = useState<number | null>(null); // null로 초기화
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestCount = async () => {
      try {
        const count = await getFtiTestCount();
        setTestCount(count);
      } catch (error) {
        console.error('테스트 참여 인원을 가져오는 데 실패했습니다:', error);
      }
    };
    fetchTestCount();
  }, []);

  const handleStart = () => {
    setShowElements(false); // 모든 요소 숨기기
    setShowMessage(true); // 메시지 표시 상태 변경
    setTimeout(() => {
      navigate('/fti/test');
    }, 2000); // 2초 후에 페이지 이동
  };

  return (
    <div className="relative mx-auto flex flex-col items-center px-[16px] md:max-w-[1200px]">
      {showElements && (
        <>
          <motion.img
            className="mt-[20px] w-[200px] drop-shadow-2xl xs:mt-[25px]"
            src="/images/ftiStart.png"
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />

          <motion.div
            className="text-center text-[72px] font-semibold xs:mt-[20px] xs:text-[20px]"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            <BlurFade delay={0.2}>
              <span className="ml-2 flex w-[350px] justify-center rounded-full bg-gradient-to-r from-blue-500 to-green-700 px-2 py-1 text-[25px] text-white xs:ml-[10px] xs:mr-[15px] xs:w-[280px] xs:justify-center xs:text-[20px]">
                # 나의 FTI는 어떤 FTI일까?
              </span>
            </BlurFade>
            <BlurFade delay={0.3}>
              <span className="flex text-[55px] xs:ml-[0px] xs:mt-2 xs:text-[20px]">
                숨은 식탐 DNA 분석해볼래? 🧬🍕
              </span>
            </BlurFade>
            <motion.div
              className="text-[17px] font-semibold xs:mt-[20px] xs:text-[20px]" // text-left 추가
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </motion.div>
          <motion.div
            className="ml-[365px] mt-[16px] w-full text-[30px] xs:ml-0 xs:text-center xs:text-[15px]"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}>
            3분만 투자하면 너의 진짜 맛잘알 지수가 나온다고! <br /> 이 초간단 테스트로 알아보자!
          </motion.div>
          {/* <span className="mt-[40px] text-center xs:mt-[20px]">
            솔직하게 답하고 너의 숨겨진 식욕 본능을 깨워볼 준비됬어? 🍽️💥
          </span> */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}>
            <RainbowButton
              className="mt-[20px] h-[65px] w-[300px] transform rounded-full bg-orange-500 shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-orange-600 active:bg-orange-700"
              onClick={handleStart}>
              <span className="relative z-50 font-bold">테스트 하기</span>
            </RainbowButton>
          </motion.div>
          <motion.div
            className="mt-[10px] w-[250px] px-2 py-1 text-center text-[15px] xs:ml-0 xs:text-[17px]"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}>
            지금까지{' '}
            {testCount !== null ? <NumberTicker value={testCount} className="text-xl font-bold" /> : '로딩 중...'}명이
            참여했어요
          </motion.div>
          <motion.p
            className="mt-[40px] text-center xs:mt-[20px] xs:text-[13px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            FTI 검사유형은 Food-Tendency-type-Indicator의 약어입니다. <br />
            검사유형으로는 8종류의 음식 성향이 있습니다.
          </motion.p>
        </>
      )}
      {showMessage && ( // 메시지 조건부 렌더링
        <motion.p
          className="mt-[400px] text-center text-[40px] xs:text-[17px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}>
          솔직하게 답하고 너의 숨겨진 식욕 본능을 <br />
          깨워볼 준비됬어? 🍽️💥
        </motion.p>
      )}
    </div>
  );
};

export default Fti;
