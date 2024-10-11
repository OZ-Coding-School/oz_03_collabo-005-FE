import { ReactNode } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

interface RoundedButtonProps {
  children: ReactNode;
  onClick: () => void;
}

const RoundedButton = ({ children, onClick }: RoundedButtonProps) => {
  return (
    <button
      className="flex h-8 items-center justify-between rounded-2xl border-2 border-[#D7D7D7] px-3 text-[14px] leading-5 text-[#333333] hover:underline xs:border-[1px]"
      onClick={onClick}>
      {children} <IoIosArrowDown className="ml-1" />
    </button>
  );
};

export default RoundedButton;
