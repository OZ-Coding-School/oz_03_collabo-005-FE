import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  buttonSize: ButtonSize;
  bgColor: BgColor;
}

type ButtonSize = 'normal';

type BgColor = 'ghost' | 'filled' | 'gray' | 'black';

const buttonSizeClasses = {
  normal: 'w-full rounded-lg',
};

const bgColorClasses: Record<BgColor, string> = {
  ghost: 'border border-primary text-primary',
  filled: 'bg-[#F56E26] text-white',
  gray: 'bg-gray-98 ',
  black: 'text-[#333333] border border-[#666666]',
};

const Button = ({ children, type = 'button', buttonSize, bgColor, onClick, className, disabled }: ButtonProps) => {
  const buttonClass = twMerge(buttonSizeClasses[buttonSize], className);
  const bgColorClass = bgColorClasses[bgColor];

  return (
    <button
      className={`${buttonClass} ${bgColorClass} whitespace-nowrap`}
      type={type}
      onClick={onClick}
      disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
