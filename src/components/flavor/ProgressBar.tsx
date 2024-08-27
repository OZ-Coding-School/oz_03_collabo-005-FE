interface ProgressBarProps {
  widthPercentage: number;
}

const ProgressBar = ({ widthPercentage }: ProgressBarProps) => {
  return (
    <div className="fixed top-[72px] h-1 w-full max-w-[600px] rounded-md bg-[#DBDBDB] xs:top-[52px]">
      <span
        className="absolute left-0 top-0 h-1 rounded-md bg-primary duration-300"
        style={{ width: `${widthPercentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
