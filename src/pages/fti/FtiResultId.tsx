import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/common/Button';
import { shareKakao } from '../../utils/shareUtils';
import { getCookie } from '../../utils/cookie';
import { MdSave } from 'react-icons/md';
import { IoIosLink } from 'react-icons/io';

declare global {
  interface Window {
    Kakao: any;
  }
}

interface Description {
  start: { text: string; people: string };
  typeDescription: string;
  characteristics: string[];
  title: { title: string; text: string };
}

const { Kakao } = window;

const ftiTypeDescriptions = {
  TID: 'TID - 걸어다니는 생생 정보통',
  ACN: 'ACN - 태어난 김에 사는 너',
  TCD: 'TCD - 일편단심 단골손님',
  AIN: 'AIN - 고독한 미식가',
  TCN: 'TCN - 인간 리트리버',
  AID: 'AID - 혼자서 다하네',
  TIN: 'TIN - 나사빠진 인공지능',
  ACD: 'ACD - 방구석 전문가',
} as const;

interface FtiResultState {
  ftiImage: string;
  description: { [key: string]: string }[];
  good_relation: string;
  good_reason: string;
  bad_relation: string;
  bad_reason: string;
  good_relation_image: string;
  bad_relation_image: string;
  fti_type: keyof typeof ftiTypeDescriptions;
}

const FtiResultId = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { uuid } = useParams<{ uuid: string }>();
  const [ftiResult, setFtiResult] = useState<FtiResultState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [parsedDescription, setParsedDescription] = useState<Description | null>(null);

  const parseDescription = (desc: { [key: string]: string }[]): Description => {
    const startText = desc[0]['시작'];
    const parts = startText.split('\n').map((str) => str.trim());
    const text = parts.slice(0, -1).join('\n');
    const people = parts[parts.length - 1];

    const typeDescription = desc[1]['유형설명'] || desc[1]['유형 설명'];

    const characteristicsText = desc[2]['특징'];
    const characteristics = characteristicsText.split('\n').map((str) => str.trim().replace('- ', ''));

    const titleKey = Object.keys(desc[3])[0];
    const titleText = desc[3][titleKey];

    return {
      start: { text, people },
      typeDescription,
      characteristics,
      title: { title: titleKey, text: titleText },
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      let result: FtiResultState | null = null;

      if (uuid) {
        // URL 파라미터로 전달된 uuid가 있는 경우
        try {
          const response = await axios.get(`/api/ftitests/result/${uuid}`);
          result = response.data;
        } catch (error) {
          console.error('FTI 결과를 불러오는 데 실패했습니다:', error);
        }
      } else if (location.state) {
        // 결과가 location.state로 전달된 경우
        result = location.state as FtiResultState;
      } else {
        // localStorage에서 데이터 불러오기 (fallback)
        const storedResult = localStorage.getItem('ftiResult');
        if (storedResult) {
          result = JSON.parse(storedResult);
        }
      }

      if (result) {
        setFtiResult(result);
        const parsed = parseDescription(result.description);
        setParsedDescription(parsed);
        localStorage.setItem('ftiResult', JSON.stringify(result));
      }

      setIsLoading(false);

      // Kakao SDK 초기화
      if (window.Kakao) {
        window.Kakao.cleanup();
        window.Kakao.init(import.meta.env.VITE_APP_KAKAO_MAP_KEY);
      } else {
        console.error('Kakao 객체를 사용할 수 없습니다.');
      }
    };

    fetchData();
  }, [location.state, uuid]);

  useEffect(() => {
    console.log('Good relation image URL:', ftiResult?.good_relation_image);
    console.log('Bad relation image URL:', ftiResult?.bad_relation_image);
  }, [ftiResult?.good_relation_image, ftiResult?.bad_relation_image]);

  const handleButtonClick = () => {
    const refreshToken = getCookie('refresh');
    if (refreshToken) {
      navigate('/flavor');
    } else {
      navigate('/signin');
    }
  };

  const handleSaveImage = () => {
    window.open(`//${ftiResult?.ftiImage}`, '_blank');
  };

  // https:// 를 추가하는 함수
  const getFullImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    return `https://${imageUrl}`;
  };

  // shareWeb 함수 수정
  const shareWeb = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      alert('현재 FTI 검사결과 URL이 클립보드에 복사되었어요.');
    });
  };

  const shareKakaoWithCurrentUrl = () => {
    const currentUrl = window.location.href;
    shareKakao(Kakao, currentUrl, ftiResult?.ftiImage || '');
  };

  return (
    <div className="flex w-full flex-col items-center px-[16px]">
      {isLoading ? (
        <div>결과를 불러오는 중입니다...</div>
      ) : ftiResult ? (
        <>
          {/* 나의 FTI 궁합 기능 */}
          <div className="mt-[52px] text-center text-[80px] font-bold">나의 FTI는</div>
          <p className="mt-[5px] w-full rounded-xl border-2 px-2 py-2 text-center text-[40px] xs:text-[28px]">
            {(() => {
              return ftiTypeDescriptions[ftiResult.fti_type as keyof typeof ftiTypeDescriptions] || ftiResult.fti_type;
            })()}
          </p>
          <div>
            <img src={`//${ftiResult.ftiImage}`} alt="FTI 결과" className="rounded-[4px]" />
            <div className="mt-[5px] flex items-center justify-center" />
            <div className="flex justify-center">
              <button
                onClick={handleSaveImage}
                className="flex h-[80px] w-full items-center justify-center rounded-xl bg-green-800 px-2 py-1 text-[20px] text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-green-600 active:scale-95">
                <MdSave className="mr-1" />
                이미지 저장
              </button>
            </div>
            <p className="text-center text-[15px] text-[#666666]">
              이미지를 저장하려면 이미지 저장버튼을 클릭하여 이미지를 꾹눌러 저장하세요.
            </p>
          </div>
          {parsedDescription && (
            <div className="mt-[5px]">
              <div className="mt-[40px] rounded-xl border-2 px-2 py-2">
                <p>{parsedDescription.start.text}</p>
                <p className="mt-[10px] text-[14px] text-[#666666]">{parsedDescription.start.people}</p>
              </div>

              <p className="mt-[30px] rounded-xl border-2 px-2 py-2">{parsedDescription.typeDescription}</p>

              <h3 className="mt-[30px] font-semibold">특징</h3>
              <ul className="mt-[5px] rounded-xl border-2 px-2 py-2">
                {parsedDescription.characteristics.map((char, index) => (
                  <li className="mt-[5px] text-[16px]" key={index}>
                    - {char}
                  </li>
                ))}
              </ul>
              <div className="mt-[52px] rounded-xl border-2 px-2 py-2">
                <h2 className="font-semibold">{`(${parsedDescription.title.title})`}</h2>
                <p>{parsedDescription.title.text}</p>
              </div>
              {/* 나의 FTI 궁합 기능 */}
              <div className="mt-[48px] text-center text-[26px] font-bold">나의 최고의 FTI 궁합은?</div>
              <div className="flex" />
              <div className="mt-[30px] flex flex-col">
                <div className="mb-[20px] text-center">
                  <div className="flex items-center">
                    <p className="mx-auto w-[80px] rounded-xl bg-slate-500 px-2 py-2 text-center text-3xl font-bold text-white transition-transform duration-300 ease-in-out hover:scale-105">
                      {ftiResult.good_relation}
                    </p>
                  </div>
                </div>
                <div className="mt-2 border-2 border-dashed" />
                <p className="mt-[5px] max-w-[600px] rounded-xl border-2 px-2 py-10 text-left text-xl">
                  {ftiResult.good_reason}
                </p>
                <img
                  src={getFullImageUrl(ftiResult.good_relation_image)}
                  alt="최고 궁합"
                  className="mx-auto mt-[10px] w-[600px] rounded-xl xs:w-[400px]"
                />
              </div>
              <div className="mt-[48px] text-center text-[26px] font-bold">나의 최악의 FTI 궁합은?</div>
              <div className="flex" />
              <div className="mt-[30px] flex flex-col">
                <div className="mb-[20px] text-center">
                  <div className="flex items-center">
                    <p className="mx-auto w-[80px] rounded-xl bg-slate-500 px-2 py-2 text-center text-3xl font-bold text-white transition-transform duration-300 ease-in-out hover:scale-105">
                      {ftiResult.bad_relation}
                    </p>
                  </div>
                </div>
                <div className="mt-2 border-2 border-dashed" />
                <p className="mt-[5px] max-w-[600px] rounded-xl border-2 px-2 py-10 text-left text-xl">
                  {ftiResult.bad_reason}
                </p>

                <img
                  src={getFullImageUrl(ftiResult.bad_relation_image)}
                  alt="최악 궁합"
                  className="mx-auto mt-[10px] w-[600px] rounded-xl xs:w-[400px]"
                />
              </div>
            </div>
          )}
          <div className="mt-[45px] flex w-full flex-col items-center">
            <p className="text-[26px] font-bold">공유하기</p>
            <div className="mt-[28px] flex gap-[16px]">
              <img
                src="/images/kakaotalk_ico.png"
                title="카카오톡 공유"
                onClick={shareKakaoWithCurrentUrl}
                className="h-[60px] w-[60px] cursor-pointer rounded-full transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
              />
              <img
                src="/images/instagram_ico.png"
                title="인스타그램 공유"
                onClick={shareWeb}
                className="h-[60px] w-[60px] cursor-pointer rounded-full transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
              />
              <img
                src="/images/snsX.png"
                title="X 공유"
                onClick={shareWeb}
                className="h-[60px] w-[60px] cursor-pointer rounded-full transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
              />
              <IoIosLink
                onClick={shareWeb}
                className="h-[60px] w-[60px] cursor-pointer rounded-full transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
                title="일반 공유"
              />
            </div>
            <Button
              bgColor="filled"
              buttonSize="normal"
              className="mt-[50px] h-[48px] bg-slate-500 transition-all duration-300 ease-in-out hover:bg-slate-700 active:bg-slate-800"
              onClick={() => (window.location.href = '/fti')}>
              <p className="text-[16px] font-bold">나도 테스트 하러가기</p>
            </Button>
            <Button
              bgColor="filled"
              buttonSize="normal"
              className="active:orange-700 mb-[32px] mt-[10px] h-[48px] transition-all duration-300 ease-in-out hover:bg-orange-600"
              onClick={handleButtonClick}>
              <p className="text-[16px] font-bold">입맛 검사하고 메뉴 추천받기</p>
            </Button>

            <p className="mt-[5px] px-2 py-2">FTI의 약어는 : Food-tendency-type-indicator입니다.</p>
            <div className="mb-[40px] px-2 py-2 text-orange-800">@2024 밥피엔스 All Rights Reserved.</div>
          </div>
        </>
      ) : (
        <div>결과를 찾을 수 없습니다.</div>
      )}
    </div>
  );
};

export default FtiResultId;
