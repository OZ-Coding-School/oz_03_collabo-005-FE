import { useForm, SubmitHandler } from 'react-hook-form';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useState, useEffect } from 'react';
import { signupAPI, checkEmailAPI, checkNicknameAPI } from '../../api/apis/auth';
import { useNavigate } from 'react-router-dom';
import ModalBottom from '../../components/common/ModalBottom';
import { getCookie } from '../../utils/cookie';

interface InputProps {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
}

const Signup = () => {
  const [nicknameLength, setNicknameLength] = useState(0);
  const [filledFields, setFilledFields] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    nickname: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    getValues,
    setError,
    clearErrors,
  } = useForm<InputProps>({
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<InputProps> = async (data) => {
    try {
      await signupAPI({
        email: data.email,
        password: data.password,
        nickname: data.nickname,
      });
      setIsModalOpen(true);
      console.log('Signup successful');
    } catch (error) {
      console.error('Signup failed', error);
    }
  };

  const handleInputChange = (fieldName: keyof InputProps) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (fieldName === 'nickname') {
      setNicknameLength(e.target.value.length);
    }
    setFilledFields((prev) => ({ ...prev, [fieldName]: e.target.value.length > 0 }));
  };

  const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value;
    const emailPattern = /\S+@\S+\.\S+/;

    if (email) {
      if (!emailPattern.test(email)) {
        setError('email', { type: 'manual', message: '이메일 양식이 올바르지 않습니다.' });
        return;
      }

      try {
        const isEmailAvailable = await checkEmailAPI(email);
        if (!isEmailAvailable) {
          setError('email', { type: 'manual', message: '이미 사용 중인 이메일입니다.' });
        } else {
          clearErrors('email');
        }
      } catch (error) {
        console.error('Email check failed', error);
      }
    }
  };

  const handleNicknameBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const nickname = e.target.value;
    if (nickname.length < 2) {
      setError('nickname', { type: 'manual', message: '닉네임은 2자 이상이어야 합니다.' });
      return;
    }
    if (nickname) {
      try {
        const isNicknameAvailable = await checkNicknameAPI(nickname);
        if (!isNicknameAvailable) {
          setError('nickname', { type: 'manual', message: '이미 사용 중인 닉네임입니다.' });
        } else {
          clearErrors('nickname');
        }
      } catch (error) {
        console.error('Nickname check failed', error);
      }
    }
  };

  useEffect(() => {
    const refreshToken = getCookie('refresh');
    if (refreshToken) {
      navigate('/'); // 리프레시 토큰이 있으면 메인 페이지로 리다이렉트
    }
  }, [navigate]);

  return (
    <>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="px-[16px] pt-[12px]">
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
            onBlur: handleEmailBlur,
          })}
          error={errors.email}
          onChange={handleInputChange('email')}
          isFilled={filledFields.email}
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
          onChange={handleInputChange('password')}
          isFilled={filledFields.password}
        />

        <Input
          title="비밀번호 확인"
          name="confirmPassword"
          placeholder="비밀번호를 한번 더 입력하세요."
          inputSize="normal"
          type="password"
          register={register('confirmPassword', {
            required: '비밀번호를 입력하세요.',
            validate: (value) => value === getValues('password') || '비밀번호가 일치하지 않습니다.',
          })}
          error={errors.confirmPassword}
          onChange={handleInputChange('confirmPassword')}
          isFilled={filledFields.confirmPassword}
        />

        <div className="relative">
          <Input
            title="닉네임"
            name="nickname"
            placeholder="닉네임을 입력하세요."
            inputSize="normal"
            type="text"
            register={register('nickname', {
              required: '닉네임을 입력하세요.',
              minLength: {
                value: 2,
                message: '닉네임은 2자 이상이어야 합니다.',
              },
              onBlur: handleNicknameBlur,
            })}
            error={errors.nickname}
            onChange={handleInputChange('nickname')}
            isFilled={filledFields.nickname}
            maxLength={10}
          />
          <div className="absolute right-0 top-[5px] text-sm text-gray-500">{nicknameLength}/10</div>
        </div>

        <Button
          buttonSize="normal"
          bgColor="filled"
          className="h-[48px] font-bold"
          disabled={isSubmitting}
          type="submit">
          가입완료
        </Button>
      </form>
      {/* 모달 컴포넌트 추가 */}
      <ModalBottom isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title1="회원가입 완료">
        <div className="mb-[53px] mt-[32px] text-center text-[14px] font-medium">가입이 완료되었습니다</div>
        <Button buttonSize="normal" bgColor="filled" className="h-[48px] font-bold" onClick={() => navigate('/signin')}>
          확인
        </Button>
      </ModalBottom>
    </>
  );
};

export default Signup;
