import { useForm, SubmitHandler } from 'react-hook-form';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface InputProps {
  email: string;
}

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
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

      <Button buttonSize="normal" bgColor="filled" className="h-[48px] font-bold" disabled={isSubmitting} type="submit">
        가입완료
      </Button>
    </form>
  );
};

export default ResetPassword;
