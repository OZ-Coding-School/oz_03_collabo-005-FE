import { useForm, SubmitHandler } from 'react-hook-form';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

interface InputProps {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
}

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    getValues,
  } = useForm<InputProps>();

  const onSubmit: SubmitHandler<InputProps> = (data) => console.log(data);

  return (
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
      />

      <Input
        title="닉네임"
        name="nickname"
        placeholder="닉네임을 입력하세요."
        inputSize="normal"
        type="text"
        register={register('nickname', {
          required: '닉네임임을 입력하세요.',
          minLength: {
            value: 2,
            message: '닉네임은 2자 이상이어야 합니다.',
          },
          maxLength: {
            value: 10,
            message: '닉네임은 10자 이하로 입력하세요.',
          },
        })}
        error={errors.nickname}
      />

      <Button buttonSize="normal" bgColor="filled" className="h-[48px] font-bold" disabled={isSubmitting} type="submit">
        가입완료
      </Button>
    </form>
  );
};

export default Signup;
