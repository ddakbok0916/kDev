import { cookies } from 'next/headers';

const API_HOST = process.env.HOST;

const setCookieHeader = () => {
  const cookieStore = cookies(); // next/headers의 cookies 함수를 사용하여 쿠키를 가져옵니다.
  return cookieStore.toString(); // 쿠키를 문자열로 변환하여 반환합니다.
};

export const FetchServer = async (endpoint, options) => {
  const response = await fetch(`${API_HOST}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json', // 내용 형식을 JSON으로 지정합니다.
      Cookie: setCookieHeader(), // 쿠키 헤더를 설정합니다.
    },
    // 'credentials' 옵션을 'include'로 설정하면, 요청 시 쿠키를 포함시킵니다.
    // 브라우저 환경에서만 유효하며, 서버측에서는 쿠키를 수동으로 헤더에 추가해야 합니다.
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json(); // 응답 본문을 JSON 형태로 파싱합니다.
};
