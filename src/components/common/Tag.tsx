import { HTMLAttributes, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

interface TagProps extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {
  onClick?: () => void;
  height: Height;
  rounded: Rounded;
  padding: Padding;
  isSelected?: boolean;
}

type Height = 'sm' | 'md' | 'lg';

type Rounded = 'sm' | 'md' | 'lg';

type Padding = 'sm' | 'lg';

const heightClasses: Record<Height, string> = {
  sm: 'h-[20px]',
  md: 'h-[24px]',
  lg: 'h-[32px]',
};

const roundedClasses: Record<Rounded, string> = {
  sm: 'rounded-[2px]',
  md: 'rounded-[8px]',
  lg: 'rounded-[16px]',
};

const paddingClasses: Record<Padding, string> = {
  sm: 'px-[8px] py-[2px]',
  lg: 'px-[12px] py-[5.5px]',
};

const Tag = ({ onClick, children, height, rounded, padding, className, isSelected = false, ...props }: TagProps) => {
  const tagClass = twMerge(
    heightClasses[height],
    roundedClasses[rounded],
    paddingClasses[padding],
    isSelected ? 'bg-[#F5E3DB] text-black font-medium' : 'bg-gray-ee text-gray-66',
    className,
  );

  return (
    <div onClick={onClick} {...props} className={`${tagClass}`}>
      {children}
    </div>
  );
};

export default Tag;
