import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatTimestamp = (timestamp: number, format: string, lang?: 'ko' | 'en'): string => {
  const tz = lang === 'en' ? 'America/New_York' : 'Asia/Seoul';
  return dayjs(timestamp).tz(tz).format(format);
};
