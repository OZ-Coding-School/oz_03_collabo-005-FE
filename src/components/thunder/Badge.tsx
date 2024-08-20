interface BadgeProps {
  label: string;
}

const Badge: React.FC<BadgeProps> = ({ label }) => (
  <span className="flex items-center justify-center rounded border border-solid bg-black bg-opacity-5 px-[6px] py-[1px] text-[14px] xs:px-[4px] xs:py-[2px] xs:text-[12px]">
    {label}
  </span>
);

export default Badge;
