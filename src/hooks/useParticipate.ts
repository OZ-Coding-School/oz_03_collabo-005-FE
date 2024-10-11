import { useState } from 'react';
import { authInstance } from '../api/util/instance';

export const useParticipate = (boardUuid: string) => {
  const [isParticipating, setIsParticipating] = useState(false);

  const toggleParticipate = async () => {
    try {
      const response = await authInstance.post('/api/reviews/participate/', { uuid: boardUuid });
      if (response.status === 200) {
        setIsParticipating((prev) => !prev);
      }
    } catch (error) {
      console.error('참여 토글 중 오류 발생:', error);
    }
  };

  return { isParticipating, toggleParticipate };
};
