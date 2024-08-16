import { IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ModalCenter from '../common/ModalCenter';
import { useState } from 'react';

interface UserLinkProps {
  text: string;
  src: string;
  isUserLoggedIn: boolean;
}

const UserLink: React.FC<UserLinkProps> = ({ text, src, isUserLoggedIn }) => {
  const [isModalCenterOpen, setIsModalCenterOpen] = useState(false);
  const openModalCenter = () => setIsModalCenterOpen(true);
  const closeModalCenter = () => setIsModalCenterOpen(false);

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!isUserLoggedIn) {
      e.preventDefault();
      openModalCenter();
    }
  };

  return (
    <>
      <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 200 }}>
        <Link
          to={isUserLoggedIn ? src : '#'}
          onClick={handleNavigate}
          className="flex w-full cursor-pointer items-center justify-between p-[1rem] text-[20px] hover:rounded-lg hover:font-bold hover:text-primary xs:py-[0.7rem] xs:text-[14px]">
          {text}
          <IoIosArrowForward className="text-[20px] xs:text-[16px]" />
        </Link>
      </motion.div>
      <ModalCenter
        isOpen={isModalCenterOpen}
        title1="로그인이 필요한 서비스 입니다."
        title2=""
        onClose={closeModalCenter}>
        <div className="mt-8 flex w-full space-x-4">
          <button
            onClick={closeModalCenter}
            className="w-full flex-1 rounded-xl border-2 border-orange-400 px-1 py-2 font-semibold text-orange-500 hover:bg-orange-50">
            취소
          </button>
          <Link to="/signin" className="flex-1">
            <button className="w-full rounded-xl bg-orange-500 px-2 py-3 font-semibold text-white hover:bg-orange-600">
              로그인
            </button>
          </Link>
        </div>
      </ModalCenter>
    </>
  );
};

export default UserLink;
