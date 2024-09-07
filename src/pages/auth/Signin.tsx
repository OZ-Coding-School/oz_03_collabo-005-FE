import { useForm, SubmitHandler } from 'react-hook-form';
import { useState, useEffect } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';
import { signinAPI } from '../../api/apis/auth';
import { getCookie } from '../../utils/cookie';
import { AxiosError } from 'axios';

interface InputProps {
  email: string;
  password: string;
}

const isAxiosError = (error: unknown): error is AxiosError => {
  return (error as AxiosError).isAxiosError !== undefined;
};

const Signin = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<InputProps>({
    mode: 'onChange',
  });

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<InputProps> = async (data) => {
    try {
      await signinAPI(data.email, data.password);
      navigate('/');
      console.log('Signin successful');
    } catch (error) {
      if (isAxiosError(error) && error.response && error.response.status === 400) {
        setErrorMessage('이메일 또는 비밀번호가 잘못되었습니다.');
      } else {
        setErrorMessage('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
      console.error('Signin failed', error);
    }
  };

  useEffect(() => {
    const refreshToken = getCookie('refresh');
    if (refreshToken) {
      navigate('/'); // 리프레시 토큰이 있으면 메인 페이지로 리다이렉트
    }
  }, [navigate]);

  return (
    <div className="relative px-[16px] pt-[12px]">
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Input
          title="이메일"
          name="email"
          placeholder="이메일을 입력하세요."
          inputSize="normal"
          type="email"
          register={register('email', {
            required: '이메일을 입력하세요.',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: '이메일 양식이 올바르지 않습니다.',
            },
          })}
          error={errors.email}
        />

        <Input
          title="비밀번호"
          name="password"
          placeholder="비밀번호를 입력하세요."
          inputSize="normal"
          type="password"
          register={register('password', {
            required: '비밀번호를 입력하세요.',
            minLength: {
              value: 6,
              message: '비밀번호는 6글자 이상이어야 합니다.',
            },
          })}
          error={errors.password}
        />

        {errorMessage && <p className="relative bottom-[10px] text-[14px] text-red">{errorMessage}</p>}

        <Button
          buttonSize="normal"
          bgColor="filled"
          className="mb-[24px] h-[48px] font-bold"
          disabled={isSubmitting}
          type="submit">
          로그인
        </Button>
        <Button buttonSize="normal" bgColor="ghost" className="h-[48px] font-bold">
          <Link to={'/signup'}>이메일로 간편 가입</Link>
        </Button>
      </form>
      <p className="mt-[16px] text-center text-[12px] text-gray-98">
        로그인(가입) 시 이용약관 및 개인정보 처리방침에 동의하는 것으로 간주합니다.
      </p>
      <p className="mt-[38px] text-[14px] font-bold text-[#999999]">
        <Link to={'/signin/resetpassword'}>비밀번호를 잊어버리셨나요?</Link>
      </p>
    </div>
  );
};

export default Signin;
