import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { MdSecurity, MdLockReset, MdAutorenew } from 'react-icons/md';

const ResetPasswordMain = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-10 flex flex-col items-center rounded-xl px-2 py-3">
      <MdSecurity className="mb-6 text-6xl" />
      <div className="mb-4 text-2xl font-bold">원하시는 메뉴를 선택해주세요.</div>
      <div className="mt-[20px] grid w-full grid-cols-2 gap-4">
        <div className="flex flex-col items-center">
          <Button
            buttonSize="normal"
            bgColor="outline"
            className="ml-[10px] flex h-[82px] w-[250px] items-center justify-center from-gray-700 to-gray-900 font-bold hover:bg-gradient-to-b hover:text-white hover:underline"
            onClick={() => navigate('/signin/resetpassword')}>
            <MdLockReset className="mr-2 text-2xl" />
            비밀번호 재설정
          </Button>
          {/* <p className="mt-2 text-sm text-gray-600">비밀번호를 잊어버리셨나요?</p> */}
        </div>
        <Button
          buttonSize="normal"
          bgColor="outline"
          className="flex h-[82px] w-[250px] items-center justify-center from-gray-700 to-gray-900 font-bold hover:bg-gradient-to-b hover:text-white hover:underline"
          onClick={() => navigate('/signin')}>
          <MdAutorenew className="mr-2 text-2xl" />
          비밀번호 변경
        </Button>
      </div>
    </div>
  );
};

export default ResetPasswordMain;
