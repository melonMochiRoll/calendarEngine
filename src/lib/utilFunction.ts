import dayjs from 'dayjs';

export const getByteSize = (str: string) => {
  const encoder = new TextEncoder();

  return encoder.encode(str).length;
};

export const isOverlapping = (startA: string, endA: string, startB: string, endB: string) => {
  const [ startA_hour, startA_minute ] = startA.split(':');
  const [ endA_hour, endA_minute ] = endA.split(':');
  const [ startB_hour, startB_minute ] = startB.split(':');
  const [ endB_hour, endB_minute ] = endB.split(':');

  const startA_date = dayjs().hour(Number(startA_hour)).minute(Number(startA_minute));
  const endA_date = dayjs().hour(Number(endA_hour)).minute(Number(endA_minute));
  const startB_date = dayjs().hour(Number(startB_hour)).minute(Number(startB_minute));
  const endB_date = dayjs().hour(Number(endB_hour)).minute(Number(endB_minute));

  return (startA_date < endB_date) && (startB_date < endA_date) ? true : false;
};

export const renderTime = (time: string) => {
  const [ hour, minute ] = time.split(':');

  return `${hour}:${minute}`;
};

export const getTodoHeight = (startTime: string, endTime: string) => {
  const tenMinuteHeight = 10;
  const [ startTime_hour, startTime_minute ] = startTime.split(':');
  const [ endTime_hour, endTime_minute ] = endTime.split(':');

  const ratio =
    (Number(`${endTime_hour === '0' || endTime_hour === '00' ? '24' : endTime_hour}`) - Number(startTime_hour)) * 6 +
    (Number(endTime_minute) - Number(startTime_minute)) / 10;

  return ratio * tenMinuteHeight;
};

export const timeToDayjs = (time: string) => {
  const [ hour, minute ] = time.split(':');
  
  return dayjs().hour(+hour).minute(+minute);
};