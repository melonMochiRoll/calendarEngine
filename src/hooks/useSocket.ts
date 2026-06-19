import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { setStatus } from "Src/features/socketStatusSlice";
import { AUTHORIZATION_HEADER_NAME, ChatToServer, CSRF_TOKEN_HEADER_NAME, SocketStatus } from "Src/constants/constants";
import { TAccessTokenPayload } from "Src/typings/types";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { refreshAuthToken } from "Src/api/authApi";
import { setAccessToken } from "Src/features/accessTokenSlice";

export function useSocket() {
  const dispatch = useAppDispatch();
  const socketRef = useRef<Socket>();
  const { token: accessToken } = useAppSelector(state => state.accessToken);
  const { token: csrfToken } = useAppSelector(state => state.csrfToken);
  const pendingMessages = useRef<Map<string, { event: string, data: any, timer: NodeJS.Timeout, retryCount: number }>>(new Map());

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
    });
    socket.on('disconnect', () => dispatch(setStatus(SocketStatus.DISCONNECTED)));
    socket.io.on('reconnect_attempt', () => dispatch(setStatus(SocketStatus.RECONNECTING)));
    socket.io.on('reconnect', () => {
      dispatch(setStatus(SocketStatus.CONNECTED));
    });
    socket.onAny((event, data) => {
      const targetId = data?.id || data?.ChatId;
      const pending = pendingMessages?.current.get(targetId);

      if (!pending) return;

      clearTimeout(pending.timer);
      pendingMessages.current.delete(targetId);
    });

    return () => {
      socket.disconnect();
      pendingMessages.current.forEach(pending => {
        clearTimeout(pending.timer);
      });
      pendingMessages.current.clear();
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

  const refreshToken = async (url?: string) => {
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
      if (url) {
        socket.emit(ChatToServer.JOIN_ROOM, url);
      }
    } catch (err) {
      throw err;
    }
  };

  return {
    socketRef,
    refreshToken,
    isTokenExpired,
    pendingMessages,
  } as const;
}
