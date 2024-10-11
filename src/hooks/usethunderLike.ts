import { useState } from 'react';
import { authInstance } from '../api/util/instance';

export const useThunderLike = (boardUuid: string) => {
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = async () => {
    try {
      const response = await authInstance.post('/api/reviews/like/', { uuid: boardUuid });
      if (response.status === 200) {
        setIsLiked((prev) => !prev);
      }
    } catch (error) {
      console.error('번개 좋아요 토글 중 오류 발생:', error);
    }
  };

  return { isLiked, toggleLike };
};
