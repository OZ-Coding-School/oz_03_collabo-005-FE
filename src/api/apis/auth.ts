import { AxiosError } from 'axios';
import { baseInstance } from '../util/instance';
import { setCookie } from '../../utils/cookie';
import { setItem } from '../../utils/storage';

interface SignupData {
  email: string;
  password: string;
  nickname: string;
}

// AxiosError인지 확인하는 타입 가드 함수
const isAxiosError = (error: unknown): error is AxiosError => {
  return (error as AxiosError).isAxiosError !== undefined;
};

export const signupAPI = async (data: SignupData) => {
  try {
    const response = await baseInstance.post<void>('/api/users/signup/', data);
    return response.data; // 성공 시 void 반환
  } catch (error) {
    console.error('Failed to signup:', error); // 에러 로그 출력
    throw error; // 에러를 throw
  }
};

export const signinAPI = async (email: string, password: string) => {
  try {
    const response = await baseInstance.post<{ access: string; refresh?: string }>('/api/users/login/', {
      email,
      password,
    });
    const access = response.data.access;

    if (response.data.refresh) {
      setCookie('refresh', response.data.refresh, 7);
    }

    setItem('access', access);
    return {
      success: true,
      message: ''
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 400) {
      return {
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.'
      };
    }
    return {
      success: false,
      message: '로그인 중 오류가 발생했습니다.'
    };
  }
};

export const checkEmailAPI = async (email: string) => {
  try {
    const response = await baseInstance.post('/api/users/checkEmail/', { email: email });
    return response.status === 200; // 중복이 아니면 true 반환
  } catch (error) {
    if (isAxiosError(error) && error.response && error.response.status === 400) {
      return false; // 중복이면 false 반환
    }
    console.error('Failed to check email:', error); // 다른 에러 로그 출력
    throw error; // 다른 에러를 throw
  }
};

export const checkNicknameAPI = async (nickname: string) => {
  try {
    const response = await baseInstance.post('/api/users/checkNickname/', { nickname: nickname });
    return response.status === 200; // 성공 시 boolean 반환
  } catch (error) {
    if (isAxiosError(error) && error.response && error.response.status === 400) {
      return false; // 중복이면 false 반환
    }
    console.error('Failed to check nickname:', error); // 다른 에러 로그 출력
    throw error; // 다른 에러를 throw
  }
};
