import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/common/Button';
import { shareWeb, shareKakao } from '../../utils/shareUtils';
import { getCookie } from '../../utils/cookie';

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

const FtiResultId = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { ftiType, ftiImage, description } = location.state || {};

  const [parsedDescription, setParsedDescription] = useState<Description | null>(null);

  const realUrl = 'https://www.babpiens.com/fti';

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
    console.log('FTI type:', ftiType);
    if (description) {
      const parsed = parseDescription(description);
      setParsedDescription(parsed);
      console.log('Parsed description:', parsed);
    }
    if (Kakao) {
      Kakao.cleanup();
      Kakao.init(import.meta.env.VITE_APP_KAKAO_MAP_KEY);
    } else {
      console.error('Kakao object is not available.');
    }
    console.log(ftiImage);
  }, [description]);

  const handleButtonClick = () => {
    const refreshToken = getCookie('refresh');
    if (refreshToken) {
      navigate('/flavor');
    } else {
      navigate('/signin');
    }
  };

  return (
    <div className="flex w-full flex-col items-center px-[16px]">
      <div>
        <img src={`//${ftiImage}`} alt="FTI Result" className="rounded-[4px]" />
        <p className="mt-[5px] text-center text-[10px] text-[#666666]">길게 눌러서 이미지를 저장해주세요.</p>
      </div>

      {parsedDescription && (
        <div className="mt-[5px]">
          <p className="mt-[40px]">{parsedDescription.start.text}</p>
          <p className="mt-[10px] text-[14px] text-[#666666]">{parsedDescription.start.people}</p>

          <p className="mt-[30px]">{parsedDescription.typeDescription}</p>

          <h3 className="mt-[30px] font-semibold">특징</h3>
          <ul className="mt-[5px]">
            {parsedDescription.characteristics.map((char, index) => (
              <li className="mt-[5px] text-[16px]" key={index}>
                - {char}
              </li>
            ))}
          </ul>
          <h2 className="mt-[52px] font-semibold">{`(${parsedDescription.title.title})`}</h2>
          <p className="">{parsedDescription.title.text}</p>
        </div>
      )}
      <div className="mt-[96px] flex w-full flex-col items-center">
        <p className="text-[26px] font-bold">공유하기</p>
        <div className="mt-[28px] flex gap-[16px]">
          <img src="/images/kakaotalk.png" alt="카카오톡 공유" onClick={() => shareKakao(Kakao, realUrl)} />
          <img
            src="/images/insta.png"
            alt="인스타그램 공유"
            onClick={() => shareWeb(realUrl)}
            className="cursor-pointer"
          />
          <img src="/images/snsX.png" alt="X 공유" onClick={() => shareWeb(realUrl)} className="cursor-pointer" />
          <img src="/images/share.png" alt="일반 공유" onClick={() => shareWeb(realUrl)} className="cursor-pointer" />
        </div>
        <Button
          bgColor="filled"
          buttonSize="normal"
          className="mb-[32px] mt-[58px] h-[48px]"
          onClick={handleButtonClick}>
          <p className="text-[16px] font-bold">입맛 검사하고 메뉴 추천받기</p>
        </Button>
      </div>
    </div>
  );
};

export default FtiResultId;
