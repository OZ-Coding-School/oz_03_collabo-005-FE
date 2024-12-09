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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);

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

  useEffect(() => {
    const checkIfInstalled = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes('android-app://');

      setIsAppInstalled(isStandalone);
    };

    checkIfInstalled();

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addListener(checkIfInstalled);

    const handleBeforeInstallPrompt = (e: Event) => {
      if (!isAppInstalled) {
        e.preventDefault();
        setDeferredPrompt(e);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setIsAppInstalled(true);
    });

    return () => {
      mediaQuery.removeListener(checkIfInstalled);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isAppInstalled]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 즉시 배너 표시
    setShowInstallBanner(true);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const getBrowser = () => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes('edg')) return 'edge';
    if (userAgent.includes('firefox')) return 'firefox';
    if (userAgent.includes('chrome')) return 'chrome';
    if (userAgent.includes('safari')) return 'safari';
    return 'other';
  };

  const handleInstallClick = async () => {
    const browser = getBrowser();
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      alert(
        'Safari 브라우저에서 공유하기 버튼을 누르고 "홈 화면에 추가" 버튼을 눌러 홈 화면에서 앱 아이콘을 누르면 실행됩니다.',
      );
      setShowInstallBanner(false);
      return;
    }

    if (browser === 'edge') {
      try {
        // Microsoft Edge의 자동 설치 API 사용
        const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
        const host = window.location.host;
        const manifestUrl = `${protocol}//${host}/manifest.json`;

        // @ts-ignore
        if (window.navigator.appInstalled !== undefined) {
          // @ts-ignore
          await window.navigator.appInstalled(manifestUrl);
          setIsAppInstalled(true);
          setShowInstallBanner(false);
          return;
        }
      } catch (error) {
        console.error('Edge 자동 설치 중 오류 발생:', error);
      }
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
          console.log('사용자가 PWA 설치를 수락했습니다');
          setIsAppInstalled(true);
          setShowInstallBanner(false);
        }
        setDeferredPrompt(null);
      } catch (error) {
        console.error('PWA 설치 중 오류 발생:', error);
        showBrowserSpecificInstructions(browser);
      }
    } else {
      showBrowserSpecificInstructions(browser);
    }
  };

  const showBrowserSpecificInstructions = (browser: string) => {
    switch (browser) {
      case 'edge':
        alert(
          '1. 주소창 오른쪽의 "앱 설치" 아이콘을 클릭하거나\n' +
            '2. 메뉴(...) → "앱 → 이 사이트를 앱으로 설치"를 선택해주세요.',
        );
        break;
      case 'chrome':
        alert('1. 주소창 오른쪽의 "앱 설치" 아이콘을 클릭하거나\n' + '2. 메뉴(⋮) → "밥피엔스 설치"를 선택해주세요.');
        break;
      case 'firefox':
        alert('1. 주소창의 홈 아이콘을 클릭하거나\n' + '2. 메뉴(≡) → "사이트 추가" → "홈 화면에 추가"를 선택해주세요.');
        break;
      default:
        alert('브라우저의 "앱 설치" 또는 "홈 화면에 추가" 기능을 이용해주세요.');
    }
  };

  return (
    <div className="mx-auto mb-[75px] flex max-w-full flex-col items-center xs:mb-[65px]">
      {showInstallBanner && (
        <div className="fixed bottom-20 left-1/2 z-50 w-[500px] -translate-x-1/2 transform rounded-lg bg-white p-4 shadow-lg xs:w-[300px]">
          <div className="mb-2 flex items-center text-left">
            <img src="/images/babpiens_favicon.jpg" alt="밥피엔스 로고" className="mr-3 h-12 w-12 rounded-lg" />
            <div>
              <p className="ml-1 text-sm font-medium">더 편리한 서비스 이용을 위해</p>
              <p className="ml-1 text-sm font-medium">밥피엔스 앱을 설치해보세요!</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90">
              밥피엔스 앱 설치하기
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
              닫기
            </button>
          </div>
        </div>
      )}
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
        linkTo="/fti"
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
