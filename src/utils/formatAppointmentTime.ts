import { format, isToday, isThisWeek, addWeeks, startOfWeek, endOfWeek, StartOfWeekOptions } from 'date-fns';
import { ko } from 'date-fns/locale';

const isNextWeek = (date: Date, options: StartOfWeekOptions = { weekStartsOn: 1 }): boolean => {
  const nextWeekStart = startOfWeek(addWeeks(new Date(), 1), options);
  const nextWeekEnd = endOfWeek(addWeeks(new Date(), 1), options);
  return date >= nextWeekStart && date <= nextWeekEnd;
};

export const formatAppointmentTime = (appointmentTime: string): string => {
  const date = new Date(appointmentTime);
  if (isToday(date)) {
    return `오늘 ${format(date, 'a h:mm', { locale: ko })}`;
  } else if (isThisWeek(date, { weekStartsOn: 1 })) {
    return `이번 주 ${format(date, 'eeee, a h:mm', { locale: ko })}`;
  } else if (isNextWeek(date, { weekStartsOn: 1 })) {
    return `다음 주 ${format(date, 'eeee, a h:mm', { locale: ko })}`;
  } else {
    return format(date, 'M월 d일 eeee, a h:mm', { locale: ko });
  }
};
