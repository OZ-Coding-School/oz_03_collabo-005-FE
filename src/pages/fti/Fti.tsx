import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { motion } from 'framer-motion'; // framer-motion 추가

const Fti = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/fti/test');
  };
  return (
    <div className="relative mx-auto flex flex-col items-center px-[16px] md:max-w-[800px]">
      <motion.img
        className="mt-[55px] xs:mt-[25px]"
        src="/images/ftiStart.png"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      />
      <p className="mt-[75px] text-[26px] font-semibold xs:mt-[20px] xs:text-[20px]">숨은 식탐 DNA 분석해볼래? 🧬🍕</p>
      <p className="mt-[16px] text-center">
        3분만 투자하면 너의 진짜 맛잘알 지수가 나온다고! <br /> 이 초간단 테스트로 알아보자!
      </p>
      <p className="mt-[40px] xs:mt-[20px]">솔직하게 답하고 너의 숨겨진 식욕 본능을 깨워봐! 🍽️💥</p>
      <Button buttonSize="normal" bgColor="filled" className="mt-[132px] h-[48px] xs:mt-[60px]" onClick={handleStart}>
        <span className="font-bold">시작하기</span>
      </Button>
    </div>
  );
};

export default Fti;
