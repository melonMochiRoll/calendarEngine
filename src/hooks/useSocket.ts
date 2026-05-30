import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { setStatus } from "Src/features/socketStatusSlice";
import { SocketStatus } from "Src/constants/constants";

export function useSocket() {
  const dispatch = useAppDispatch();
  const socketRef = useRef<Socket>();
  const { token } = useAppSelector(state => state.csrfToken);

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(
      `${process.env.REACT_APP_SERVER_ORIGIN}`,
      {
        withCredentials: true,
        auth: {
          'x-csrf-token': token,
        },
      },
    );

    const socket = socketRef.current;

    socket?.on('connect', () => dispatch(setStatus(SocketStatus.CONNECTED)));
    socket?.on('disconnect', () => dispatch(setStatus(SocketStatus.DISCONNECTED)));
    socket?.io.on('reconnect_attempt', () => dispatch(setStatus(SocketStatus.RECONNECTING)));
    socket?.io.on('reconnect', () => dispatch(setStatus(SocketStatus.CONNECTED)));

    return () => {
      socket?.off('connect', () => dispatch(setStatus(SocketStatus.CONNECTED)));
      socket?.off('disconnect', () => dispatch(setStatus(SocketStatus.DISCONNECTED)));
      socket?.io.off('reconnect_attempt', () => dispatch(setStatus(SocketStatus.RECONNECTING)));
      socket?.io.off('reconnect', () => dispatch(setStatus(SocketStatus.CONNECTED)));
    };
  }, [token]);

  return { socketRef } as const;
}
