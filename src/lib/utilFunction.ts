import dayjs from 'dayjs';

export const getByteSize = (str: string) => {
  const encoder = new TextEncoder();

  return encoder.encode(str).length;
};

export const renderTime = (time: string) => {
  const [ hour, minute ] = time.split(':');

  return `${hour}:${minute}`;
};

export const getTodoHeight = (startTime: string, endTime: string) => {
  const tenMinuteHeight = 10;
  const [ startTime_hour, startTime_minute ] = startTime.split(':');
  const [ endTime_hour, endTime_minute ] = endTime.split(':');

  const height =
    ((Number(`${endTime_hour === '0' || endTime_hour === '00' ? '24' : endTime_hour}`) - Number(startTime_hour)) * 6 +
    (Number(endTime_minute) - Number(startTime_minute)) / 10)
    * tenMinuteHeight;

  return height > 30 ? height : 30;
};

export const timeToDayjs = (time: string) => {
  const [ hour, minute ] = time.split(':');
  
  return dayjs().hour(+hour).minute(+minute);
};

export const formatDateTime = (date: string) => {
  if (!date) return '';
  
  const splited = date.split(/[:-TZ]/);

  if (splited.length < 5) {
    return date;
  }

  return [ splited[0], splited.slice(1, 3).join(':') ].join(' ');
};