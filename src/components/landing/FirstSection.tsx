import { Link } from 'react-router-dom';
import { User } from '../../types/types';

interface FirstSectionProps {
  isVisible: boolean;
  setIsImageLoaded: (loaded: boolean) => void;
  user: User | undefined;
}

const FirstSection: React.FC<FirstSectionProps> = ({ isVisible, setIsImageLoaded, user }) => (
  <div className="relative z-10 flex h-[550px] w-full max-w-[800px] flex-col justify-between bg-gradient-to-r from-black/40 to-black/60 p-4 pb-0 xs:h-[440px]">
    <div className="mx-2 mt-14 text-[32px] font-bold text-white xs:mt-7 xs:text-[28px]">
      당신의 미각을 깨우는
      <br />
      맞춤형 메뉴와
      <br />
      색다른 설렘이 있는 곳
    </div>
    <div className="mt-auto flex justify-between">
      <img
        src="/images/HomeMonkey.svg"
        alt="monkey"
        className={`${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} block h-[240px] transition-transform duration-1000 xs:h-[200px]`}
        onLoad={() => setIsImageLoaded(true)}
      />
      <Link
        to={user?.spicy_preference ? '/foods' : '/flavor'}
        className="mr-20 flex h-12 w-40 items-center justify-center rounded-xl bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600 xs:mr-0 xs:px-3 xs:text-[14px]">
        {user?.spicy_preference ? '음식 추천받기' : '입맛 설정하기'}
      </Link>
    </div>
  </div>
);

export default FirstSection;
