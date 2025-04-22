import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

const useSocket = () => {
  const { url = '' } = useParams();
  const socketRef = useRef<Socket>();
  const isDevelopment = process.env.REACT_APP_NODE_ENV === 'development';
  const origin = isDevelopment ? process.env.REACT_APP_DEVELOPMENT_SERVER_ORIGIN : process.env.REACT_APP_PRODUCTION_SERVER_ORIGIN;

  useEffect(() => {
    socketRef.current = io(`${origin}/sharedspace-${url}`);

    return () => {
      socketRef.current?.disconnect();
    };
  }, [url]);

  if (!socketRef.current) {
    return { socket: null };
  }

  return { socket: socketRef.current } as const;
};

export default useSocket;