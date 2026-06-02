import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { setStatus } from "Src/features/socketStatusSlice";
import { SocketStatus } from "Src/constants/constants";

export function useSocket() {
  const dispatch = useAppDispatch();
  const [ socket, setSocket ] = useState<Socket | null>(null);
  const { token } = useAppSelector(state => state.csrfToken);

  useEffect(() => {
    if (!token) return;

    const newSocket = io(
      `${process.env.REACT_APP_SERVER_ORIGIN}`,
      {
        withCredentials: true,
        auth: {
          'x-csrf-token': token,
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
  }, [token]);

  return { socket } as const;
}
