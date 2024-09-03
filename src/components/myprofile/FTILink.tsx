import { Link } from 'react-router-dom';

interface FTILinkProps {
  ftiType: string | null;
}

export const FTILink: React.FC<FTILinkProps> = ({ ftiType }) => {
  return ftiType ? (
    <p className="text-[1rem] font-medium">{ftiType}</p>
  ) : (
    <Link
      to={'/FTI'}
      className="mt-3 flex h-[52px] w-[33%] items-center justify-center rounded-lg bg-[#F5E3DB] text-[1rem] font-bold xs:h-[42px] xs:w-[40%] xs:text-[13px]">
      FTI 설정하기
    </Link>
  );
};
