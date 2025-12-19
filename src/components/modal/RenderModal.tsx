import React, { FC } from 'react';
import { useAppSelector } from 'Hooks/reduxHooks';
import { ModalName } from 'Typings/types';

export const modals = {
  [ModalName.SEARCH]: {
    title: '',
    component: React.lazy(() => import('Components/modal/search/SearchModal')),
  },
  [ModalName.SHAREDSPACEMANAGER]: {
    title: '',
    component: React.lazy(() => import('Components/modal/sharedspaceManager/SharedspaceManagerModal')),
  },
  [ModalName.TODO_INPUT]: {
    title: 'Todo 작성',
    component: React.lazy(() => import('Components/modal/todo/TodoInput')),
  },
  [ModalName.TODO_DETAIL]: {
    title: 'Todo',
    component: React.lazy(() => import('Components/modal/todo/TodoDetail')),
  },
  [ModalName.TODO_UPDATE]: {
    title: 'Todo 수정',
    component: React.lazy(() => import('Components/modal/todo/TodoUpdate')),
  },
  [ModalName.SHAREDSPACEMEMBERLIST]: {
    title: '멤버 목록',
    component: React.lazy(() => import('Components/modal/sharedspaceMemberList/SharedspaceMemberListModal'))
  },
  [ModalName.JOINREQUEST_SENDER]: {
    title: '스페이스 액세스 권한 요청',
    component: React.lazy(() => import('Components/modal/joinrequest/JoinRequestSenderModal'))
  },
  [ModalName.JOINREQUEST_MANAGER]: {
    title: '액세스 권한 요청 목록',
    component: React.lazy(() => import('Components/modal/joinrequest/joinrequestManager/JoinRequestManagerModal')),
  },
  [ModalName.JOINREQUEST_DETAIL]: {
    title: '',
    component: React.lazy(() => import('Components/modal/joinrequest/JoinRequestDetail')),
  },
  [ModalName.IMAGE_VIEWER]: {
    title: '',
    component: React.lazy(() => import('Components/modal/imageViewer/ImageViewer')),
  },
};

const RenderModal: FC = () => {
  const modalStack = useAppSelector(state => state.modal);

  if (!modalStack.length) return null;

  return (
    modalStack.map((modal, idx) => {
      const ModalComponent = modals[modal.name].component as React.LazyExoticComponent<React.ComponentType<any>>;
      const props = {
        ...modal.props,
        idx,
        title: modals[modal.name].title,
      };

      return (
        <ModalComponent key={modal.name} { ...props } />
      );
    })
  );
};

export default RenderModal;