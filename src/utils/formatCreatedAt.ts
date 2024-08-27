import { format, differenceInMinutes, differenceInHours } from 'date-fns';
import { ko } from 'date-fns/locale';

export const formatCreatedAt = (createdAt: string): string => {
  const date = new Date(createdAt);
  const now = new Date();

  const minutesDifference = differenceInMinutes(now, date);
  const hoursDifference = differenceInHours(now, date);

  if (minutesDifference < 1) {
    return '방금 전';
  } else if (minutesDifference < 60) {
    return `${minutesDifference}분 전`;
  } else if (hoursDifference < 24) {
    return `${hoursDifference}시간 전`;
  } else {
    return format(date, 'M월 d일 ', { locale: ko });
  }
};
