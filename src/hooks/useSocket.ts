import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { setStatus } from "Src/features/socketStatusSlice";
import { AUTHORIZATION_HEADER_NAME, CSRF_TOKEN_HEADER_NAME, SocketStatus } from "Src/constants/constants";

export function useSocket() {
  const dispatch = useAppDispatch();
  const [ socket, setSocket ] = useState<Socket | null>(null);
  const { token: accessToken } = useAppSelector(state => state.accessToken);
  const { token: csrfToken } = useAppSelector(state => state.csrfToken);

  useEffect(() => {
    if (!csrfToken) return;

    const newSocket = io(
      `${process.env.REACT_APP_SERVER_ORIGIN}`,
      {
        withCredentials: true,
        auth: {
          [AUTHORIZATION_HEADER_NAME]: `Bearer ${accessToken}`,
          [CSRF_TOKEN_HEADER_NAME]: csrfToken,
        },
      },
    );

    newSocket.on('connect', () => {
      setSocket(newSocket);
      dispatch(setStatus(SocketStatus.CONNECTED));
    });
    newSocket.on('disconnect', () => {
      setSocket(null);
      dispatch(setStatus(SocketStatus.DISCONNECTED));
    });
    newSocket.io.on('reconnect_attempt', () => dispatch(setStatus(SocketStatus.RECONNECTING)));
    newSocket.io.on('reconnect', () => {
      setSocket(newSocket);
      dispatch(setStatus(SocketStatus.CONNECTED));
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [csrfToken, accessToken]);

  return { socket } as const;
}
