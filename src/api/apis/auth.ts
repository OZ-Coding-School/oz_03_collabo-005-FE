import { baseInstance } from '../util/instance';
import { setCookie } from '../../utils/cookie';
import { setItem } from '../../utils/storage';

interface SignupData {
  email: string;
  password: string;
  nickname: string;
}

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
      setCookie('refresh', response.data.refresh, 7); // 리프레시 쿠키에 저장
    }

    setItem('access', access);
  } catch (error) {
    console.error('Failed to login:', error); // 에러 로그 출력
    throw error; // 에러를 throw
  }
};
