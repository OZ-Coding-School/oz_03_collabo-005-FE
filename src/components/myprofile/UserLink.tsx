import { IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface UserLinkProps {
  text: string;
  src: string;
  isUserLoggedIn: boolean;
}

const UserLink: React.FC<UserLinkProps> = ({ text, src, isUserLoggedIn }) => {
  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!isUserLoggedIn) {
      e.preventDefault();
      // 추후 모달로 수정
      alert('로그인 후 이용하실 수 있습니다.');
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 200 }}>
      <Link
        to={isUserLoggedIn ? src : '#'}
        onClick={handleNavigate}
        className="flex w-full cursor-pointer items-center justify-between p-[1rem] text-[20px] hover:rounded-lg hover:font-bold hover:text-primary xs:py-[0.7rem] xs:text-[14px]">
        {text}
        <IoIosArrowForward className="text-[20px] xs:text-[16px]" />
      </Link>
    </motion.div>
  );
};

export default UserLink;
