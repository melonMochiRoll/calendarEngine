import axios from 'axios';
import dayjs from 'dayjs';
import React from 'react';
import { RoleDictionary } from 'Typings/types';

export const getOrigin = () => {
  const isDevelopment = process.env.REACT_APP_NODE_ENV === 'development';
  return isDevelopment ? process.env.REACT_APP_DEVELOPMENT_SERVER_ORIGIN : process.env.REACT_APP_PRODUCTION_SERVER_ORIGIN;
};

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
  
  const splited = date.split(/[:-T+Z]/);

  return `${splited[0]} ${splited[1]}:${splited[2]}`;
};

export const formatDate = (date: string) => {
  if (!date) return '';

  const splited = date.split(/[-T]/);

  return `${splited[0]}년 ${splited[1]}월 ${splited[2]}일`;
};

export const handleRetry = (noRetryStatusCodes: number[], failureCount: number, error: unknown) => {
  const errorCode = axios.isAxiosError(error) && error?.response?.status || 500;

  if (noRetryStatusCodes.includes(errorCode)) {
    return false;
  }

  return failureCount < 3;
}

export const renderRole = (roleName: string) => {
  const result = Object
    .entries(RoleDictionary)
    .find((ele) => ele[0] === roleName.toUpperCase());

  return result ? result[1] : '';
};

export const lazyComponentWithPreload = (fetchFunction: () => Promise<{ default: React.ComponentType<any> }>)  => {
  return {
    component: React.lazy(fetchFunction),
    preload: fetchFunction,
  };
};