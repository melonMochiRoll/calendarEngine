
export const ERROR_TYPE = {
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
};

export const ChatEmitEvent = {
  SEND_SHAREDSPACE_CHAT: 'send_sharedspace_chat',
} as const;

export const SocketStatus = {
  CONNECTED: '연결됨',
  DISCONNECTED: '연결 끊어짐',
  CONNECTING: '연결 중',
  RECONNECTING: '연결 시도 중',
};