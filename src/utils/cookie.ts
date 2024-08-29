// 쿠키 값을 가져오는 함수
export function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`; // 모든 쿠키 문자열 가져오기
  const parts = value.split(`; ${name}=`); // 특정 쿠키 이름으로 분할
  if (parts.length === 2) return parts.pop()?.split(';').shift(); // 쿠키 값 반환
}

// 쿠키를 설정하는 함수
export function setCookie(name: string, value: string, days?: number): void {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // 만료 날짜 설정
    expires = `; expires=${date.toUTCString()}`; // 만료 날짜 문자열 생성
  }
  document.cookie = `${name}=${value}${expires}; path=/; secure; samesite=strict`; // 쿠키 설정
}

// 쿠키를 삭제하는 함수
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`; // 만료 날짜를 과거로 설정하여 쿠키 삭제
}
