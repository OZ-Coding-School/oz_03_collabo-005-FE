import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RiArrowRightSLine } from 'react-icons/ri';

const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* 첫 번째 section */}
      <div className="relative z-10 h-[600px] w-full max-w-[800px] bg-gradient-to-r from-neutral-200 to-neutral-400 p-4 text-center">
        <div className="mt-40 text-[50px] font-bold text-white">
          밥은 못해줘도 <br />
          멋진메뉴는 알려준다!
        </div>
        <Link
          to="/Flavor"
          className="ml-[350px] mt-4 flex h-12 w-40 items-center justify-center rounded-xl bg-orange-500 px-4 py-2 text-center font-bold text-white hover:bg-orange-600">
          입맛 설정하기
        </Link>
        <img
          src="/images/HomeMonkey.svg"
          alt="monkey"
          className={`absolute bottom-0 left-0 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>

      {/* 두 번째 section*/}
      <div className="w-full max-w-[800px] bg-slate-100 bg-gradient-to-r from-gray-100 to-gray-200 p-4 text-center">
        <h2 className="mt-20 text-2xl font-semibold text-orange-500">개인별 음식추천</h2>
        <p className="mt-10 text-3xl font-bold">
          나의 입맛을 알아서 척척! <br />
          입맛 예언자 밥피엔스
        </p>
        <p className="mt-10 text-lg text-gray-500">
          원초적 맛 본능을 깨우는 메뉴 추천으로, 매일 새로운 맛<br />의 모험을 시작해보세요
        </p>

        <div className="flex justify-center">
          <Link
            to="/Foods"
            className="gray-400 mt-4 flex h-12 w-32 items-center justify-center rounded-[20px] bg-white px-4 py-2 font-bold hover:bg-orange-600 hover:text-white">
            더보기 <RiArrowRightSLine size={20} />
          </Link>
        </div>
        <img src="/images/HomeExample.svg" alt="example" className="mx-auto mb-20 mt-20" />
      </div>

      {/* 세 번째 section */}
      <div className="w-full max-w-[800px] bg-slate-100 p-4 text-center">
        <h2 className="mt-20 text-2xl font-semibold text-orange-500">FTI 검사 </h2>
        <p className="mt-10 text-3xl font-bold">
          당신의 음식 DNA를 찾아서 <br />
          미식 탐험이 시작됩니다.
        </p>
        <p className="mt-10 text-gray-500">
          밥피엔스의 FTI 검사로 나의 성향을 발견하세요.
          <br />
          MBTI보다 재밌는 나만의 미식 탐험!
          <br />
        </p>
        <div className="flex justify-center">
          <Link
            to="/Fti"
            className="gray-400 mt-4 flex h-12 w-32 items-center justify-center rounded-[20px] bg-white px-4 py-2 font-bold hover:bg-orange-600 hover:text-white">
            더보기 <RiArrowRightSLine size={20} />
          </Link>
        </div>
        <img src="/images/HomeExample.svg" alt="example" className="mx-auto mb-20 mt-20" />
      </div>

      {/* 네 번째 section  - thunder*/}
      <div className="w-full max-w-[800px] bg-slate-100 bg-gradient-to-r from-gray-100 to-gray-200 p-4 text-center">
        <h2 className="mt-20 text-2xl font-semibold text-orange-500">소셜다이닝</h2>
        <p className="mt-10 text-3xl font-bold">
          우리는 입맛으로 통한다. <br />
          메뉴와 만남이 어우러지는 소셜다이닝
        </p>
        <p className="mt-10 text-gray-500">
          입맛 친구들과 즐거운 만남, <br />
          밥피엔스와 함께라면 매 끼니가 특별해 집니다.
        </p>
        <div className="flex justify-center">
          <Link
            to="/Thunder"
            className="gray-400 mt-4 flex h-12 w-32 items-center justify-center rounded-[20px] bg-white px-4 py-2 font-bold hover:bg-orange-600 hover:text-white">
            더보기 <RiArrowRightSLine size={20} />
          </Link>
        </div>
        <img src="/images/HomeExample.svg" alt="example" className="mx-auto mb-20 mt-20" />
      </div>

      {/* 다섯번째 section- review*/}
      <div className="w-full max-w-[800px] bg-slate-100 p-4 text-center">
        <h2 className="mt-20 text-2xl font-semibold text-orange-500">맛있는 발견</h2>
        <p className="mt-10 text-3xl font-bold">
          맛의 트렌드를 공유하고 <br />
          새로운 경험을 나눠보세요.
        </p>
        <p className="mt-10 text-gray-500">
          즐거움 가득한 음식이야기
          <br />
          맛있는 후기를 공유하고 미식의 즐거움을 나눠보세요
        </p>
        <div className="flex justify-center">
          <Link
            to="/Board"
            className="gray-400 mt-4 flex h-12 w-32 items-center justify-center rounded-[20px] bg-white px-4 py-2 font-bold hover:bg-orange-600 hover:text-white">
            더보기 <RiArrowRightSLine size={20} />
          </Link>
        </div>
        <img src="/images/HomeExample.svg" alt="example" className="mx-auto mb-20 mt-20" />
      </div>

      {/* 여섯번째 section 아이콘 영역
      기획팀에서 sns 사용유무 결정*/}
      <div className="flex w-full max-w-[800px] flex-col items-center justify-center bg-neutral-50 p-4 text-center">
        <div className="mb-5 flex items-center justify-center">
          {/* <img src="/images/Logo_instagram.svg" alt="instagram" className="flex" />
           */}
        </div>
        <div className="mb-20 text-orange-800">@2024 밥피엔스 All Rights Reserved.</div>
      </div>
    </div>
  );
};
export default Landing;
