import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { setStatus } from "Src/features/socketStatusSlice";
import { AUTHORIZATION_HEADER_NAME, ChatToServer, CSRF_TOKEN_HEADER_NAME, SocketStatus } from "Src/constants/constants";
import { TAccessTokenPayload, TChatToServer } from "Src/typings/types";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { refreshAuthToken } from "Src/api/authApi";
import { setAccessToken } from "Src/features/accessTokenSlice";

export function useSocket() {
  const dispatch = useAppDispatch();
  const socketRef = useRef<Socket>();
  const { token: accessToken } = useAppSelector(state => state.accessToken);
  const { token: csrfToken } = useAppSelector(state => state.csrfToken);
  const eventQueue = useRef<{ event: TChatToServer, data: any }[]>([]);

  useEffect(() => {
    if (!csrfToken) return;

    socketRef.current = io(
      `${process.env.REACT_APP_SERVER_ORIGIN}`,
      {
        withCredentials: true,
        auth: {
          [AUTHORIZATION_HEADER_NAME]: `Bearer ${accessToken}`,
          [CSRF_TOKEN_HEADER_NAME]: csrfToken,
        },
      },
    );

    const socket = socketRef.current;

    socket.on('connect', () => {
      dispatch(setStatus(SocketStatus.CONNECTED));
      eventQueue.current.forEach(({ event, data }) => socket.emit(event, data));
      eventQueue.current = [];
    });
    socket.on('disconnect', () => dispatch(setStatus(SocketStatus.DISCONNECTED)));
    socket.io.on('reconnect_attempt', () => dispatch(setStatus(SocketStatus.RECONNECTING)));
    socket.io.on('reconnect', () => {
      dispatch(setStatus(SocketStatus.CONNECTED));
      eventQueue.current.forEach(({ event, data }) => socket.emit(event, data));
      eventQueue.current = [];
    });

    return () => {
      socket.disconnect();
      eventQueue.current = [];
    };
  }, [csrfToken]);

  const isTokenExpired = () => {
    if (!accessToken) {
      return false;
    }

    const accessTokenPayload = jwtDecode<TAccessTokenPayload>(accessToken);
    const isExpired = dayjs().isSameOrAfter(dayjs(accessTokenPayload.exp, 'X'));

    return isExpired;
  };

  const refreshToken = async () => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    try {
      const { newAccessToken } = await refreshAuthToken();
      dispatch(setAccessToken({ token: newAccessToken }));

      socket.auth = Object.assign(
        socket.auth,
        { [AUTHORIZATION_HEADER_NAME]: `Bearer ${newAccessToken}` }
      );

      socket.disconnect().connect();
    } catch (err) {
      throw err;
    }
  };

  return {
    socketRef,
    refreshToken,
    isTokenExpired,
    eventQueue,
  } as const;
}
