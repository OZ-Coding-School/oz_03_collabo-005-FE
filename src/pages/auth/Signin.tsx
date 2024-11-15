import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { signinAPI } from '../../api/apis/auth';
import { getCookie } from '../../utils/cookie';
import ModalCenter from '../../components/common/ModalCenter';
import { FaLock } from 'react-icons/fa';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const re = /\S+@\S+\.\S+/;
    if (!email) {
      setEmailError('이메일을 입력하세요.');
      return false;
    } else if (!re.test(email)) {
      setEmailError('이메일 양식이 올바르지 않습니다.');
      return false;
    } else {
      setEmailError(null);
      return true;
    }
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('비밀번호를 입력하세요.');
      return false;
    } else if (password.length < 6) {
      setPasswordError('비밀번호는 6글자 이상이어야 합니다.');
      return false;
    } else {
      setPasswordError(null);
      return true;
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrorMessage(null);
    validateEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrorMessage(null);
    validatePassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      try {
        const result = await signinAPI(email, password);
        if (result.success) {
          console.log('로그인 성공');
          window.location.href = '/'; // 성공 시 바로 메인 페이지로 이동 및 새로고침
        } else {
          setShowErrorModal(true);
          setErrorMessage(result.message);
        }
      } catch (error) {
        setErrorMessage('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
        console.error('Signin failed', error);
      }
    }
  };

  useEffect(() => {
    const refreshToken = getCookie('refresh');
    if (refreshToken) {
      navigate('/'); // refresh token이 있으면 메인 페이지로 redirect
    }
  }, [navigate]);

  return (
    <div className="relative mx-auto w-full max-w-full rounded-2xl border-2 bg-white p-4 px-[16px] shadow-2xl md:mx-auto md:max-w-[700px] md:pt-2 xs:mb-20">
      <ModalCenter
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title1="로그인에 성공하여 메인페이지로 이동합니다"
        title2=""
      />
      <ModalCenter
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title1="등록되지 않은 사용자입니다."
        title2="이메일과 비밀번호를 다시 확인해주세요.">
        <Button
          buttonSize="normal"
          bgColor="filled"
          className="mt-4 h-12 font-bold transition-transform duration-300 ease-in-out hover:bg-orange-600 active:bg-orange-700"
          onClick={() => setShowErrorModal(false)}>
          확인
        </Button>
      </ModalCenter>
      <form noValidate onSubmit={handleSubmit}>
        <Input
          title="이메일"
          name="email"
          placeholder="이메일을 입력하세요."
          inputSize="normal"
          type="email"
          value={email}
          onChange={handleEmailChange}
          error={emailError ? { type: 'manual', message: emailError } : undefined}
          className="transition-all duration-200 ease-in-out hover:border-2 hover:border-blue-500"
        />

        <Input
          title="비밀번호"
          name="password"
          placeholder="비밀번호를 입력하세요."
          inputSize="normal"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          error={passwordError ? { type: 'manual', message: passwordError } : undefined}
          className="transition-all duration-200 ease-in-out hover:border-2 hover:border-blue-500"
        />

        {errorMessage && <p className="relative bottom-[10px] text-[14px] text-red">{errorMessage}</p>}

        <Button
          buttonSize="normal"
          bgColor="filled"
          className="hover:scale-102 active:scale-99 mb-[24px] h-[48px] font-bold transition-transform duration-300 ease-in-out hover:bg-orange-600 active:bg-orange-700"
          type="submit">
          로그인
        </Button>
        <Button
          buttonSize="normal"
          bgColor="ghost"
          className="h-[48px] font-bold transition-transform duration-300 ease-in-out hover:bg-orange-100 active:bg-orange-200"
          onClick={() => navigate('/signup')}>
          이메일로 간편 가입
        </Button>
      </form>
      <p className="mt-[16px] text-center text-[12px] text-gray-98">
        로그인(가입) 시 이용약관 및 개인정보 처리방침에 동의하는 것으로 간주합니다.
      </p>
      <p className="mt-[38px] flex items-center justify-center text-[14px] font-bold text-[#999999]">
        <FaLock className="mr-2" />
        <span onClick={() => navigate('/signin/resetpasswordmain')} className="cursor-pointer hover:underline">
          비밀번호를 잊어버렸거나 재설정이 필요하신가요?
        </span>
      </p>
    </div>
  );
};

export default Signin;
