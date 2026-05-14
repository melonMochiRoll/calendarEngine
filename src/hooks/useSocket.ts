import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "./reduxHooks";

export function useSocket() {
  const socketRef = useRef<Socket>();
  const { token } = useAppSelector(state => state.csrfToken);

  useEffect(() => {
    socketRef.current = io(
      `${process.env.REACT_APP_SERVER_ORIGIN}`,
      {
        withCredentials: true,
        auth: {
          'x-csrf-token': token,
        },
      },
    );
  }, [token]);

  return { socketRef } as const;
}