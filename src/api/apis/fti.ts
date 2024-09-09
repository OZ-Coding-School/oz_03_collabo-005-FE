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
    return response.data;
  } catch (error) {
    console.error('Failed to send FTI result:', error);
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
