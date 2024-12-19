
export type InputTypeAttribute = 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week';

export type TErrorResponse = {
  error: string,
  message: string,
  path: string,
  statusCode: number,
  timestamp: string,
};

export type TQueryStatus = 'error' | 'success' | 'loading';

export const ModalName = {
  SEARCH: 'SEARCH',
  SHAREDSPACEMANAGER: 'SHAREDSPACEMANAGER',
  TODO_INPUT: 'TODO_INPUT',
  TODO_DETAIL: 'TODO_DETAIL',
  SHAREDSPACEMEMBERLIST: 'SHAREDSPACEMEMBERLIST',
  JOINREQUEST_SENDER: 'JOINREQUEST_SENDER',
  JOINREQUEST_MANAGER: 'JOINREQUEST_MANAGER',
  IMAGE_VIEWER: 'IMAGE_VIEWER',
  CLOSE: '',
} as const;

export type TModalName = typeof ModalName[keyof typeof ModalName];

export type TModals = Record<keyof typeof ModalName, React.ReactNode | null>;

export const NestedModalName = {
  TODO_UPDATE: 'TODO_UPDATE',
  JOINREQUEST_DETAIL: 'JOINREQUEST_DETAIL',
  CLOSE: '',
} as const;

export type TNestedModalName = typeof NestedModalName[keyof typeof NestedModalName];

export type TNestedModals = Record<keyof typeof NestedModalName, React.ReactNode | null>;

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
  date: Date,
  createdAt: Date,
};

export type TTodo = {
  id: number,
  description: string,
  startTime: string,
  endTime: string,
  date: string,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date | null,
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

export type TSearchTodos = 
  Pick<TTodo, 'id' | 'description' | 'date' | 'startTime' | 'endTime'> & {
    Sharedspace: Pick<TSharedspace, 'url'>,
  }
;

export type TSharedspaceMembers = {
  SharedspaceId: number,
  UserId: number,
  RoleId: number,
  createdAt: Date,
  updatedAt: Date,
  Role: {
    name: string,
  }
};

export type TSharedspace = {
  id: number,
  name: string,
  private: boolean,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date | null,
  OwnerId: number,
  url: string,
};

export type TSubscribedspaces = {
  Sharedspace: Pick<TSharedspace, 'name' | 'url' | 'private'> & { Owner: Pick<TUser, 'email'> },
} & TSharedspaceMembers;

export const SubscribedspacesFilter = {
  ALL: 'all',
  OWNED: 'owned',
  UNOWNED: 'unowned',
} as const;

export type TSubscribedspacesFilter = typeof SubscribedspacesFilter[keyof typeof SubscribedspacesFilter];

export type TSharedspaceMembersAndUser = Pick<TSharedspaceMembers, 'UserId' | 'RoleId' | 'createdAt'> &
{
  User: Pick<TUser, 'email' | 'profileImage'>
} & {
  Role: {
    name: string,
  }
};

export type TSharedspaceMetaData = Pick<TSharedspace, 'id' | 'name' | 'url' | 'private'> &
{
  Owner: Pick<TUser, 'id' | 'email'>,
} &
{
  Sharedspacemembers: TSharedspaceMembersAndUser[],
};

export type TSearchUsers = Pick<TUser, 'id' | 'email' | 'profileImage'> &
{
  Sharedspacemembers: Pick<TSharedspaceMembers, 'SharedspaceId' | 'RoleId'>[]
};

export type TJoinRequest = {
  id: number,
  RequestorId: number,
  createdAt: Date,
  message: string,
  Requestor: Pick<TUser, 'email' | 'profileImage'>,
};

export type TChat = {
  id: number;
  content: string;
  SenderId: number | null;
  SharedspaceId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type TChatList = Pick<TChat,
  'id' |
  'content' |
  'SenderId' |
  'SharedspaceId' |
  'createdAt' |
  'updatedAt'> & {
    Sender: Pick<TUser, 'email' | 'profileImage'>,
    Images: Pick<TImages, 'id' | 'path'>[],
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