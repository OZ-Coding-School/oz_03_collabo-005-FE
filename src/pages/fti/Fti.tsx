import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

const Fti = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/fti/test');
  };
  return (
    <div className="flex flex-col items-center px-[16px]">
      <img className="mt-[55px]" src="/images/ftiStart.png" />
      <p className="mt-[75px] text-[26px]">숨은 식탐 DNA 분석해볼래? 🧬🍕</p>
      <p className="mt-[16px] text-center">
        3분만 투자하면 너의 진짜 맛잘알 지수가 나온다고! <br /> 이 초간단 테스트로 알아보자!
      </p>
      <p className="mt-[40px]">솔직하게 답하고 너의 숨겨진 식욕 본능을 깨워봐! 🍽️💥</p>
      <Button buttonSize="normal" bgColor="filled" className="mt-[132px] h-[48px]" onClick={handleStart}>
        <span className="font-bold">시작하기</span>
      </Button>
    </div>
  );
};

export default Fti;
