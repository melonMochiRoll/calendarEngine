
export const AUTHORIZATION_HEADER_NAME = 'authorization';

export const CSRF_TOKEN_HEADER_NAME = 'x-csrf-token';

export const ERROR_TYPE = {
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  UNAUTHORIZED_ERROR: 'UNAUTHORIZED_ERROR',
};

export const ChatToServer = {
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  SEND_CHAT: 'send_chat',
  UPDATE_CHAT: 'update_chat',
  DELETE_CHAT: 'delete_chat',
  DELETE_CHAT_IMAGE: 'delete_chat_image',
} as const;

export const ChatToClient = {
  CHAT_CREATED: 'chat_created',
  CHAT_UPDATED: 'chat_updated',
  CHAT_DELETED: 'chat_deleted',
  CHAT_IMAGE_DELETED: 'chat_image_deleted',
  CHAT_ERROR: 'chat_error',
  READY: 'ready',
} as const;

export const SocketStatus = {
  CONNECTED: '연결됨',
  DISCONNECTED: '연결 끊어짐',
  CONNECTING: '연결 중',
  RECONNECTING: '연결 시도 중',
};