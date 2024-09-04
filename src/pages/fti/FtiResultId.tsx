import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/common/Button';
import { getFtiType } from '../../api/apis/fti';
import { useEffect } from 'react';

const { Kakao } = window;

const FtiResultId = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { ftiType, uuid } = location.state || {};

  const realUrl = 'https://www.babpiens.com/fti';

  const getFtiData = async () => {
    try {
      const data = await getFtiType(uuid);
      console.log('FTI type:', data);
    } catch (error) {
      console.error('Failed to get FTI type:', error);
    }
  };

  const shareWeb = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'FTI검사 너도 받아볼래?',
          text: 'FTI검사하고 음식 추천까지! 완전 럭키비키잖아~🍀',
          url: 'https://www.babpiens.com/fti',
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      alert('Web Share API is not supported in your browser.');
    }
  };

  const shareKakao = () => {
    if (Kakao) {
      Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: 'FTI검사 너도 받아볼래?',
          description: 'FTI검사하고 음식 추천까지! 완전 럭키비키잖아~🍀',
          imageUrl: '/images/babpience_logo2.png',
          link: {
            mobileWebUrl: realUrl,
          },
        },
        buttons: [
          {
            title: '나도 테스트 하러가기',
            link: {
              mobileWebUrl: realUrl,
            },
          },
        ],
      });
    } else {
      console.error('Kakao object is not available.');
    }
  };

  useEffect(() => {
    if (Kakao) {
      Kakao.cleanup();
      Kakao.init(import.meta.env.VITE_APP_KAKAO_MAP_KEY);
      console.log(Kakao.isInitialized());
    } else {
      console.error('Kakao object is not available.');
    }
    getFtiData();
  }, []);

  return (
    <div className="flex w-full flex-col items-center px-[16px]">
      <div className="mt-[20px]">
        <p className="h-[40px] text-[20px]">당신의 음식 유형</p>
        <p>걸어다니는 생생 정보통</p>
      </div>
      <div>이미지</div>
      <div>텍스트</div>
      <div className="mt-[96px] flex flex-col items-center">
        <p className="text-[26px] font-bold">공유하기</p>
        <div className="mt-[28px] flex gap-[16px]">
          <img src="/images/kakaotalk.png" alt="카카오톡 공유" onClick={shareKakao} />
          <img src="/images/insta.png" alt="인스타그램 공유" onClick={shareWeb} className="cursor-pointer" />
          <img src="/images/snsX.png" alt="X 공유" onClick={shareWeb} className="cursor-pointer" />
          <img src="/images/share.png" alt="일반 공유" onClick={shareWeb} className="cursor-pointer" />
        </div>
        <p className="mt-[52px] text-[26px]">음식 탐색 궁합</p>
        <div className="mt-[28px] flex gap-[20px]">
          <div className="flex flex-col items-center">
            <div className="rounded-[8px] bg-black px-[8px] py-[1px] text-[26px] text-white">최고</div>
            <p className="my-[16px] text-[20px]">인간 리트리버/수정</p>
            <img src="/images/ftiResult.png" alt="" />
          </div>
          <div className="flex flex-col items-center">
            <div className="rounded-[8px] bg-black px-[8px] py-[1px] text-[26px] text-white">최악</div>
            <p className="my-[16px] text-[20px]">나사빠진 도라에몽/수정</p>
            <img src="/images/ftiResult.png" alt="" />
          </div>
        </div>
        <Button bgColor="filled" buttonSize="normal" className="mb-[32px] mt-[24px] h-[48px]">
          <p className="text-[16px] font-bold">입맛 검사하고 메뉴 추천받기</p>
        </Button>
      </div>
    </div>
  );
};

export default FtiResultId;
