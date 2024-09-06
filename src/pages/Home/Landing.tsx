import { useEffect, useState } from 'react';
import FirstSection from '../../components/landing/FirstSection';
import Section from '../../components/landing/Section';
import Footer from '../../components/landing/Footer';
import FoodSection from '../../components/landing/FoodSection';
import { authInstance, isTokenExpired, refreshAccessToken } from '../../api/util/instance';
import { getItem } from '../../utils/storage';

const Landing: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [spicy, setSpicy] = useState<number | undefined | null>(undefined);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        let token = getItem('access');
        if (!token || isTokenExpired(token)) {
          token = await refreshAccessToken('noErrorCode');
        }
        if (token) {
          const res = await authInstance.get('/api/profile/');
          setSpicy(res.data.spicy_preference);
        }
      } catch (error) {
        console.error('Failed to fetch profile or refresh token:', error);
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto mb-[75px] flex max-w-full flex-col items-center xs:mb-[65px]">
      <FirstSection isVisible={isVisible} setIsImageLoaded={setIsImageLoaded} spicy={spicy} />
      {spicy !== undefined && <FoodSection spicy={spicy} />}
      <Section
        title="FTI 검사"
        subtitle={
          <span>
            당신의 음식 DNA를 찾아서
            <br />
            미식 탐험이 시작됩니다.
          </span>
        }
        description="밥피엔스의 FTI 검사로 나의 성향을 발견하세요. MBTI보다 재밌는 나만의 미식 탐험!"
        linkTo="/FTI"
        buttonText="더보기"
        isImageLoaded={isImageLoaded}
        setIsImageLoaded={setIsImageLoaded}
        imgUrl="/images/fti.svg"
      />
      <Section
        title="개인별 음식추천"
        subtitle={
          <span>
            나의 입맛을 알아서 척척!
            <br />
            입맛 예언자 밥피엔스
          </span>
        }
        description="원초적 맛 본능을 깨우는 메뉴 추천으로, 매일 새로운 맛의 모험을 시작해보세요."
        linkTo="/foods"
        buttonText="더보기"
        isImageLoaded={isImageLoaded}
        setIsImageLoaded={setIsImageLoaded}
        imgUrl="/images/flavor.svg"
      />
      <Section
        title="소셜다이닝"
        subtitle={
          <span>
            우리는 입맛으로 통한다.
            <br />
            메뉴와 만남이 어우러지는 소셜다이닝
          </span>
        }
        description="입맛 친구들과 즐거운 만남, 밥피엔스와 함께라면 매 끼니가 특별해 집니다."
        linkTo="/thunder"
        buttonText="더보기"
        isImageLoaded={isImageLoaded}
        setIsImageLoaded={setIsImageLoaded}
        imgUrl="/images/social.svg"
      />
      <Section
        title="맛있는 발견"
        subtitle={
          <span>
            맛의 트렌드를 공유하고
            <br />
            새로운 경험을 나눠보세요.
          </span>
        }
        description="즐거움 가득한 음식이야기, 맛있는 후기를 공유하고 미식의 즐거움을 나눠보세요."
        linkTo="/board"
        buttonText="더보기"
        isImageLoaded={isImageLoaded}
        setIsImageLoaded={setIsImageLoaded}
        imgUrl="/images/board.svg"
      />
      <Footer />
    </div>
  );
};

export default Landing;
