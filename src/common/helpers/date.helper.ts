import timezone from 'dayjs/plugin/timezone';
import isoWeek from 'dayjs/plugin/isoWeek';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);

type DateByWeekDayInTZOptions = {
  weekStart: Dayjs;
  dow: number;
  time: string;
};

export function getDateByWeekDayInTZ({
  weekStart,
  dow,
  time,
}: DateByWeekDayInTZOptions): dayjs.Dayjs {
  const [hour, minute] = time.split(':').map(Number);

  return weekStart
    .clone()
    .add(dow - 1, 'day')
    .hour(hour)
    .minute(minute)
    .second(0)
    .millisecond(0);
}

export { dayjs, Dayjs, utc, timezone };
