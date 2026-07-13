import { ImageViewerProps } from "Components/modal/imageViewer/ImageViewer";
import { JoinRequestDetailProps } from "Components/modal/joinrequest/joinrequestManager/JoinRequestDetail";
import { TodoDetailProps } from "Components/modal/todo/TodoDetail";
import { TodoUpdateProps } from "Components/modal/todo/TodoUpdate";
import { ProfileImageUpdaterModalProps } from "Src/components/modal/profileImageUpdater/ProfileImageUpdaterModal";
import { ChatToServer, ERROR_TYPE, SocketStatus } from "Src/constants/constants";

export type InputTypeAttribute = 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week';

export type TErrorResponse = {
  code: string,
  message: string,
  path: string,
  timestamp: string,
};

export type TQueryStatus = 'error' | 'success' | 'loading';

export const ModalName = {
  SEARCH: 'SEARCH',
  SHAREDSPACEMANAGER: 'SHAREDSPACEMANAGER',
  TODO_INPUT: 'TODO_INPUT',
  TODO_DETAIL: 'TODO_DETAIL',
  TODO_UPDATE: 'TODO_UPDATE',
  SHAREDSPACEMEMBERLIST: 'SHAREDSPACEMEMBERLIST',
  JOINREQUEST_SENDER: 'JOINREQUEST_SENDER',
  JOINREQUEST_MANAGER: 'JOINREQUEST_MANAGER',
  JOINREQUEST_DETAIL: 'JOINREQUEST_DETAIL',
  IMAGE_VIEWER: 'IMAGE_VIEWER',
  SHAREDSPACE_INVITE_RECEIVED: 'SHAREDSPACE_INVITE_RECEIVED',
  SHAREDSPACE_INVITE_SEND: 'SHAREDSPACE_INVITE_SEND',
  PROFILEIMAGE_UPDATER: 'PROFILEIMAGE_UPDATER',
  FRIENDSHIPS: 'FRIENDSHIPS',
} as const;

export type TModalName = typeof ModalName[keyof typeof ModalName];

export type ModalPayload = 
  | { name: typeof ModalName.SEARCH, props?: {} }
  | { name: typeof ModalName.SHAREDSPACEMANAGER, props?: {} }
  | { name: typeof ModalName.TODO_INPUT, props?: {} }
  | { name: typeof ModalName.TODO_DETAIL, props: TodoDetailProps }
  | { name: typeof ModalName.TODO_UPDATE, props: TodoUpdateProps }
  | { name: typeof ModalName.SHAREDSPACEMEMBERLIST, props?: {} }
  | { name: typeof ModalName.JOINREQUEST_SENDER, props?: {} }
  | { name: typeof ModalName.JOINREQUEST_MANAGER, props?: {} }
  | { name: typeof ModalName.JOINREQUEST_DETAIL, props: JoinRequestDetailProps }
  | { name: typeof ModalName.IMAGE_VIEWER, props: ImageViewerProps }
  | { name: typeof ModalName.SHAREDSPACE_INVITE_RECEIVED, props?: {} }
  | { name: typeof ModalName.SHAREDSPACE_INVITE_SEND, props?: {} }
  | { name: typeof ModalName.PROFILEIMAGE_UPDATER, props: ProfileImageUpdaterModalProps }
  | { name: typeof ModalName.FRIENDSHIPS, props?: {} }
;

export const RoleDictionary = {
  OWNER: '소유자',
  MEMBER: '멤버',
  VIEWER: '뷰어',
} as const;

export const SharedspaceMembersRoles = {
  OWNER: 'owner',
  MEMBER: 'member',
  VIEWER: 'viewer',
} as const;

export type TSharedspaceMembersRoles = typeof SharedspaceMembersRoles[keyof typeof SharedspaceMembersRoles];

export const MemberOptions = {
  UPDATE_MEMBER: 'update_member',
  UPDATE_OWNER: 'update_owner',
  DELETE_MEMBER: 'delete_member',
} as const;

export type TUser = {
  id: string,
  email: string,
  nickname: string,
  provider: string,
  status: string,
  ProfileImage: string,
};

export type TTodoPayload = {
  id: string,
  description: string,
  date: string,
  startTime: string,
  endTime: string,
  createdAt: string,
  updatedAt: string,
  Author: Pick<TUser, 'nickname'>,
  Editor: Pick<TUser, 'nickname'>,
};

export type TTodoMap = {
  [key: string]: TTodoPayload[],
};

export type TSearchTodosItem = {
  id: string,
  description: string,
  date: string,
  startTime: string,
  endTime: string,
};

export type TSearchTodosPayload = {
  todos: TSearchTodosItem[],
  hasMoreData: boolean,
};

export type TSharedspace = {
  id: string,
  name: string,
  private: boolean,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
  OwnerId: number,
  url: string,
};

export type TSharedspaceMetaData = TSharedspace & {
  permission: {
    isOwner: boolean,
    isMember: boolean,
    isViewer: boolean,
  },
};

export type TSubscribedspace = Pick<TSharedspace, 'name' | 'url' | 'private'> & {
  Owner: Pick<TUser, 'email' | 'nickname' | 'ProfileImage'>,
  permission: {
    isOwner: boolean,
  }
};

export type TSubscribedspacesResponse = {
  spaces: TSubscribedspace[],
  totalCount: number,
};

export const subscribedspacesSortsMap: { [key: string]: string } = {
  all: '모든 스페이스',
  owned: '소유한 스페이스',
  unowned: '소유하지 않은 스페이스',
} as const;

export type TSpaceMembers = {
  id: string,
  UserId: string,
  email: string,
  nickname: string,
  ProfileImage: string,
  RoleName: string,
  createdAt: string,
};

export type TSharedspaceMembersResponse = {
  members: TSpaceMembers[],
  hasMoreData: boolean,
};

export type TChatspaceMembersResponse = {
  members: TSpaceMembers[],
  memberCount: number,
  hasMoreData: boolean,
};

export type TSearchUser = {
  id: string,
  email: string,
  nickname: string,
  ProfileImage: string,
  permission: {
    isParticipant: boolean,
  },
};

export type TSearchUsersResponse = {
  users: TSearchUser[],
  hasMoreData: boolean,
};

export type TJoinRequest = {
  id: string,
  RequestorId: number,
  createdAt: string,
  message: string,
  Requestor: Pick<TUser, 'email' | 'nickname' | 'ProfileImage'>,
};

export type TJoinRequestsResponse = {
  joinRequests: TJoinRequest[],
  hasMoreData: boolean,
};

export type TChat = {
  id: string;
  content: string;
  SenderId: string;
  SpaceId: string;
  createdAt: string;
  updatedAt: string;
  removedAt: string | null;
};

export type TChatPayload = Pick<TChat,
  'id' |
  'content' |
  'SenderId' |
  'createdAt' |
  'updatedAt'> & {
    Sender: Pick<TUser, 'email' | 'nickname' | 'ProfileImage'>,
    ChatImages: Array<Pick<TImages, 'id' | 'path'> & { _tempPath?: string }>,
    permission: {
      isSender: boolean,
    },
  } & {
    _oldContent?: string,
    _status?: TChatStatus,
    _imageFiles?: File[],
    _retryAction?: () => void,
    _clearAction?: () => void,
  };

export const ChatStatus = {
  SUCCESS: 'success',
  PENDING: 'pending',
  ERROR: 'error',
} as const;

export type TChatStatus = typeof ChatStatus[keyof typeof ChatStatus];

export type TChats = {
  chats: TChatPayload[],
  hasMoreData: boolean,
};

export type TImages = {
  id: string;
  path: string;
  ChatId: string;
};

export type TImageMetaData = {
  fileName: string,
  fileSize: number,
  contentType: string,
};

export type TInvite = {
  id: string,
  createdAt: string,
  SharedspaceName: string,
  url: string,
  Owner: Pick<TUser, 'email' | 'nickname' | 'ProfileImage'>,
};

export type TInvitePayload = {
  invites: TInvite[],
  hasMoreData: boolean,
};

export type TSocketStatus = typeof SocketStatus[keyof typeof SocketStatus];

export type TAccessTokenPayload = {
  UserId: string,
  exp: number,
};

export type TChatToServer = typeof ChatToServer[keyof typeof ChatToServer];

export type TErrorType = typeof ERROR_TYPE[keyof typeof ERROR_TYPE];

export type TFriendshipResponse = {
  friendships: TFriendship[],
  hasMoreData: boolean,
};

export type TFriendshipRequestsResponse = {
  friendshipRequests: TFriendship[],
  hasMoreData: boolean,
};

export type TFriendship = {
  id: string,
  RequesterId: string,
  email: string,
  nickname: string,
  status: string,
  ProfileImage: string,
};

export type TFriendshipSearchUser = {
  id: string,
  email: string,
  nickname: string,
  ProfileImage: string,
  permission: {
    isFriendship: boolean,
  },
};

export type TFriendshipSearchUsersResponse = {
  users: TFriendshipSearchUser[],
  hasMoreData: boolean,
};