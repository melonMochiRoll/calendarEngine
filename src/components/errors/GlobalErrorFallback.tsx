import React, { useEffect } from "react";
import { PATHS } from "Constants/paths";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { addError, clearErrors, ErrorPriority } from "Features/globalErrorSlice";
import { useAppDispatch, useAppSelector } from "Hooks/reduxHooks";
import { FallbackProps } from "react-error-boundary";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { defaultToastOption, needLogin, privateTooltip, waitingMessage } from "Constants/notices";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function GlobalErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { url: _url } = useParams();
  const errors = useAppSelector(state => state.globalError);

  const getErrorPayload = (error: any, status: number) => {
    const result = {
      code: error?.response?.data?.code || '',
      priority: 99,
      status,
      timestamp: error?.response?.data?.timestamp || dayjs.utc().tz(dayjs.tz.guess()).format('YYYY-MM-DD HH:mm:ss'),
      message: waitingMessage,
      path: error?.response?.data?.path || '',
      destination: PATHS.INTERNAL,
    };

    switch (error?.code) {
      case 'ERR_NETWORK':
        result.priority = ErrorPriority.NETWORK_ERROR;
        break;
      case 'ERR_BAD_RESPONSE':
        result.priority = ErrorPriority.SERVER_5XX;
        break;
      case 'ERR_BAD_REQUEST':
        if (status === 401) {
          result.priority = ErrorPriority.SERVER_401;
          result.message = needLogin;
          result.destination = PATHS.LOGIN;
          break;
        }
        if (status === 403) {
          result.priority = ErrorPriority.SERVER_403;
          result.message = privateTooltip;
          result.destination = `${PATHS.JOINREQUEST_SENDER}/${_url}`;
          break;
        }
        if (status === 404) {
          result.priority = ErrorPriority.SERVER_404;
          result.destination = PATHS.NOTFOUND;
          break;
        }

        result.priority = ErrorPriority.SERVER_4XX;
        break;
      default:
        result.priority = ErrorPriority.UNKNOWN_ERROR;
        break;
    }

    return result;
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      dispatch(addError(
        getErrorPayload(error, error?.response?.status || 500)
      ));
    }, 500);
    
    return () => {
      clearTimeout(debounce);
    };
  }, []);

  useEffect(() => {
    const head = errors[0];

    const debounce = setTimeout(() => {
      toast.error(head?.message, {
        ...defaultToastOption,
        toastId: head?.message,
      });
      dispatch(clearErrors());
      resetErrorBoundary();
      navigate(head?.destination);
    }, 500);

    return () => {
      clearTimeout(debounce);
    };
  }, [errors]);

  return <></>;
}