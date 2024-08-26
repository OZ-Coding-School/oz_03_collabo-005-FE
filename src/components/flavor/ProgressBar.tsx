interface ProgressBarProps {
  widthPercentage: number;
}

const ProgressBar = ({ widthPercentage }: ProgressBarProps) => {
  return (
    <div className="relative h-1 w-full rounded-md bg-[#DBDBDB]">
      <span
        className="absolute left-0 top-0 h-1 rounded-md bg-primary duration-300"
        style={{ width: `${widthPercentage}%` }}></span>
    </div>
  );
};

export default ProgressBar;
