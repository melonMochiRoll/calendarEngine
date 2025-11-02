import { ImageViewerProps } from "Components/modal/imageViewer/ImageViewer";
import { JoinRequestDetailProps } from "Components/modal/joinrequest/JoinRequestDetail";
import { TodoDetailProps } from "Components/modal/todo/TodoDetail";
import { TodoUpdateProps } from "Components/modal/todo/TodoUpdate";

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
  | { name: typeof ModalName.IMAGE_VIEWER, props: ImageViewerProps };

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
  id: number,
  email: string,
  profileImage: string,
  Sharedspacemembers: Array<
    {
      SharedspaceId: Pick<TSharedspaceMembers, 'SharedspaceId'>,
      Sharedspace: Pick<TSharedspace, 'url' | 'private'>,
      Role: { name: string },
    }
  >
};

export type TLocalTodo = {
  id: string,
  contents: string,
  isComplete: boolean,
  date: string,
  createdAt: string,
};

export type TTodo = {
  id: number,
  description: string,
  startTime: string,
  endTime: string,
  date: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
  AuthorId: number,
  EditorId: number | null,
  SharedspaceId: number,
  Author: {
    email: Pick<TUser, 'email'>
  },
  Editor: {
    email: Pick<TUser, 'email'>,
  } | null,
};

export type TSearchTodos = Pick<TTodo,
  'id' |
  'description' |
  'date' |
  'startTime' |
  'endTime'>;

export type TSharedspaceMembers = {
  SharedspaceId: number,
  UserId: number,
  RoleId: number,
  createdAt: string,
  updatedAt: string,
  Role: {
    name: string,
  }
};

export type TSharedspace = {
  id: number,
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
  owner: string,
  permission: {
    isOwner: boolean,
  }
};

export type TSubscribedspaces = {
  spaces: TSubscribedspace[],
  totalCount: number,
};

export const subscribedspacesSortsMap: { [key: string]: string } = {
  all: '모든 스페이스',
  owned: '소유한 스페이스',
  unowned: '소유하지 않은 스페이스',
} as const;

export type TSharedspaceMembersAndUser = Pick<TSharedspaceMembers, 'UserId' | 'RoleId' | 'createdAt'> &
{
  User: Pick<TUser, 'email' | 'profileImage'>
} & {
  Role: {
    name: string,
  }
};

export type TSearchUsers = Pick<TUser, 'id' | 'email' | 'profileImage'> &
{
  Sharedspacemembers: Pick<TSharedspaceMembers, 'SharedspaceId' | 'RoleId'>[]
};

export type TJoinRequest = {
  id: number,
  RequestorId: number,
  createdAt: string,
  message: string,
  Requestor: Pick<TUser, 'email' | 'profileImage'>,
};

export type TChat = {
  id: number;
  content: string;
  SenderId: number | null;
  SharedspaceId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type TChatList = Pick<TChat,
  'id' |
  'content' |
  'SenderId' |
  'createdAt' |
  'updatedAt'> & {
    Sender: Pick<TUser, 'email' | 'profileImage'>,
    Images: Pick<TImages, 'id' | 'path'>[],
    permission: {
      isSender: boolean,
    },
  };

export type TChats = {
  chats: TChatList[],
  hasMoreData: boolean,
};

export type TImages = {
  id: number;
  path: string;
  ChatId: number;
};

export const ChatsCommandList = {
  CHAT_CREATED: 'chat_created',
  CHAT_UPDATED: 'chat_updated',
  CHAT_DELETED: 'chat_deleted',
  CHAT_IMAGE_DELETED: 'chat_image_deleted',
} as const;