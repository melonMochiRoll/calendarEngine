
export const ERROR_TYPE = {
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
};

export const ChatToServer = {
  SHAREDSPACE_JOIN_ROOM: 'sharedspace_join_room',
  SHAREDSPACE_LEAVE_ROOM: 'sharedspace_leave_room',
  SHAREDSPACE_SEND_CHAT: 'sharedspace_send_chat',
  SHAREDSPACE_UPDATE_CHAT: 'sharedspace_update_chat',
  SHAREDSPACE_DELETE_CHAT: 'sharedspace_delete_chat',
  SHAREDSPACE_DELETE_CHAT_IMAGE: 'sharedspace_delete_chat_image',
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