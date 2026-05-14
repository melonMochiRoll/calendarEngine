
export const ERROR_TYPE = {
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
};

export const ChatToServer = {
  JOIN_SHAREDSPACE_ROOM: 'join_sharedspace_room',
  LEAVE_SHAREDSPACE_ROOM: 'leave_sharedspace_room',
  SEND_SHAREDSPACE_CHAT: 'send_sharedspace_chat',
  UPDATE_SHAREDSPACE_CHAT: 'update_sharedspace_chat',
  DELETE_SHAREDSPACE_CHAT: 'delete_sharedspace_chat',
  DELETE_SHAREDSPACE_CHAT_IMAGE: 'delete_sharedspace_chat_image',
} as const;

export const ChatToClient = {
  SHAREDSPACE_CHAT_CREATED: 'sharedspace_chat_created',
  SHAREDSPACE_CHAT_UPDATED: 'sharedspace_chat_updated',
  SHAREDSPACE_CHAT_DELETED: 'sharedspace_chat_deleted',
  SHAREDSPACE_CHAT_IMAGE_DELETED: 'sharedspace_chat_image_deleted',
  SHAREDSPACE_CHAT_ERROR: 'sharedspace_chat_error',
} as const;

export const ChatAckStatus = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export const SocketStatus = {
  CONNECTED: '연결됨',
  DISCONNECTED: '연결 끊어짐',
  CONNECTING: '연결 중',
  RECONNECTING: '연결 시도 중',
};