
export const ERROR_TYPE = {
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
};

export const ChatEmitEvent = {
  SEND_SHAREDSPACE_CHAT: 'send_sharedspace_chat',
  UPDATE_SHAREDSPACE_CHAT: 'update_sharedspace_chat',
  DELETE_SHAREDSPACE_CHAT: 'delete_sharedspace_chat',
  DELETE_SHAREDSPACE_CHAT_IMAGE: 'delete_sharedspace_chat_image',
} as const;

export const ChatsCommandList = {
  CHAT_CREATED: 'chat_created',
  CHAT_UPDATED: 'chat_updated',
  CHAT_DELETED: 'chat_deleted',
  CHAT_IMAGE_DELETED: 'chat_image_deleted',
  CHAT_ERROR: 'chat_error',
} as const;

export const SocketStatus = {
  CONNECTED: '연결됨',
  DISCONNECTED: '연결 끊어짐',
  CONNECTING: '연결 중',
  RECONNECTING: '연결 시도 중',
};