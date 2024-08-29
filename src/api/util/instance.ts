import axios, { AxiosInstance } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { getItem, setItem, removeItem } from '../../utils/storage';
import { getCookie, setCookie, deleteCookie } from '../../utils/cookie';

// 인증된 API 요청을 위한 Axios 인스턴스를 생성하는 함수
const createAuthAPI = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL, // 기본 URL 설정
  });

  // 요청 인터셉터 설정
  instance.interceptors.request.use(
    async (config) => {
      let token = getItem('access'); // 로컬 스토리지에서 액세스 토큰 가져오기

      if (!token) {
        throw new Error('No access token'); // 토큰이 없으면 에러 발생
      }

      if (isTokenExpired(token)) {
        token = await refreshAccessToken(); // 토큰이 만료되었으면 재발급
        if (!token) {
          logout(); // 재발급 실패 시 로그아웃
          throw new Error('Failed to refresh token'); // 에러 발생
        }
      }

      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`; // 토큰을 헤더에 추가
      }
      return config; // 수정된 설정 반환
    },
    (error) => {
      return Promise.reject(error); // 요청 에러 처리
    },
  );

  return instance; // Axios 인스턴스 반환
};

export const authInstance = createAuthAPI(); // 인증된 API 요청을 위한 인스턴스 생성

export const baseInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL, // 기본 URL 설정
});

// JWT 토큰이 만료되었는지 확인하는 함수
export function isTokenExpired(token: string): boolean {
  try {
    const decoded: { exp: number } = jwtDecode(token); // 토큰 디코딩
    const currentTime = Date.now() / 1000; // 현재 시간 (초 단위)
    return decoded.exp < currentTime; // 만료 시간과 현재 시간 비교
  } catch (error) {
    return true; // 디코딩 에러 시 만료된 것으로 간주
  }
}

// 리프레시로 액세스 다시 받는 함수
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const refresh = getCookie('refresh'); // 리프레시 토큰 가져오기
    if (!refresh) {
      throw new Error('No refresh token available'); // 리프레시 토큰이 없으면 에러 발생
    }

    const response = await baseInstance.post<{ access: string; refresh?: string }>('/api/token/refresh/', {
      refresh,
    }); // 새 액세스 토큰 요청
    const newAccess = response.data.access; // 새 액세스 토큰 저장

    setItem('access', newAccess); // 로컬 스토리지에 새 액세스 토큰 저장
    if (response.data.refresh) {
      setCookie('refresh', response.data.refresh, 7); // 새 리프레시 토큰이 있으면 쿠키에 저장
    }

    return newAccess; // 새 액세스 토큰 반환
  } catch (error) {
    console.error('Failed to refresh access token:', error); // 에러 로그 출력
    return null; // 실패 시 null 반환
  }
}

// 로그아웃 함수
function logout(): void {
  removeItem('access'); // 로컬 스토리지에서 액세스 토큰 삭제
  deleteCookie('refresh'); // 쿠키에서 리프레시 토큰 삭제
  window.location.href = '/home'; // 홈 페이지로 리디렉션
}
