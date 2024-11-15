import { baseInstance, authInstance } from '../util/instance';
import { getCookie } from '../../utils/cookie';

export const getFtiQuestions = async () => {
  try {
    const response = await baseInstance.get('/api/ftitests/question/');
    return response.data;
  } catch (error) {
    console.error('Failed to get FTI questions:', error);
    throw error;
  }
};

export const sendFtiResult = async (result: string[]) => {
  try {
    const refreshToken = getCookie('refresh');
    const instance = refreshToken ? authInstance : baseInstance;

    const response = await instance.post('/api/ftitests/result/', { fti_style: result });
    return response.data; // UUID를 포함한 응답 데이터를 반환합니다
  } catch (error) {
    console.error('FTI 결과를 보내는데 실패했습니다:', error);
    throw error;
  }
};

export const getFtiType = async (uuid: string) => {
  try {
    const response = await baseInstance.get(`/api/ftitests/result/${uuid}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get FTI type:', error);
    throw error;
  }
};

export const getFtiResult = async (uuid: string) => {
  try {
    const response = await baseInstance.get(`/api/ftitests/result/${uuid}`);
    return response.data as {
      uuid: string;
      fti_type: number;
      description: string;
      good_relation: string;
      good_reason: string;
      bad_relation: string;
      bad_reason: string;
      fti_image_url: string;
    };
  } catch (error) {
    console.error('FTI 결과를 가져오는데 실패했습니다:', error);
    throw error;
  }
};

export const getFtiTestCount = async () => {
  try {
    const response = await baseInstance.get('/api/ftitests/count/');
    return response.data.test_count;
  } catch (error) {
    console.error('FTI 테스트 횟수를 가져오는데 실패했습니다:', error);
    throw error;
  }
};
