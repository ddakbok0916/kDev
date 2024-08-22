export const FetchClient = async (endpoint, options) => {
  try {
    const response = await fetch(`${endpoint}`, {
      headers: {
        'Content-Type': 'application/json', // 내용 형식을 JSON으로 지정합니다.
      },
      ...options,
    });
    if (!response.ok) {
      throw new Error('fetch error');
    }
    return response.json(); // 응답 본문을 JSON 형태로 파싱합니다.
  } catch {
    return { error: '서버와 통신중 오류가 발생했습니다.' };
  }
};
