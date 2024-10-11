import { IoBusinessOutline } from 'react-icons/io5';
import { TbEditCircle } from 'react-icons/tb';
import { TbDatabaseSearch } from 'react-icons/tb';

const Footer: React.FC = () => (
  <div className="flex w-full max-w-[800px] flex-col items-center justify-center bg-neutral-50 p-4 py-[40px] text-center md:max-w-full xs:max-w-[600px]">
    <div className="flex items-center justify-center">
      {/* <img src="/images/Logo_instagram.svg" alt="instagram" className="flex" /> */}
    </div>
    <div className="text-orange-800">@2024 밥피엔스 All Rights Reserved.</div>

    {/* 구분선 추가 */}
    <div className="my-4 h-px w-full bg-gray-300" />
    <div className="text-center font-bold text-sky-800">
      <IoBusinessOutline className="mr-2 inline-block" />
      사업개발
    </div>
    <p className="text-center text-sky-800">오수경, 김명석, 전두열</p>

    {/* 구분선 추가 */}
    <div className="my-4 h-px w-full bg-gray-300" />

    <div className="text-center font-bold text-sky-800">
      <TbEditCircle className="mr-2 inline-block" />
      프론트엔드
    </div>

    <p className="text-center text-sky-800">장진영, 김보람, 김준현</p>

    {/* 구분선 추가 */}
    <div className="my-4 h-px w-full bg-gray-300" />

    <div className="text-center font-bold text-sky-800">
      <TbDatabaseSearch className="mr-2 inline-block" />
      벡엔드
    </div>
    <p className="text-center text-sky-800">노성우, 신현민</p>
  </div>
);

export default Footer;
