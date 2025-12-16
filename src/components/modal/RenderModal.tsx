import React, { FC } from 'react';
import { useAppSelector } from 'Hooks/reduxHooks';
import { ModalName } from 'Typings/types';

export const modals = {
  [ModalName.SEARCH]: React.lazy(() => import('Components/modal/search/SearchModal')),
  [ModalName.SHAREDSPACEMANAGER]: React.lazy(() => import('Components/modal/sharedspaceManager/SharedspaceManagerModal')),
  [ModalName.TODO_INPUT]: React.lazy(() => import('Components/modal/todo/TodoInput')),
  [ModalName.TODO_DETAIL]: React.lazy(() => import('Components/modal/todo/TodoDetail')),
  [ModalName.TODO_UPDATE]: React.lazy(() => import('Components/modal/todo/TodoUpdate')),
  [ModalName.SHAREDSPACEMEMBERLIST]: React.lazy(() => import('Components/modal/sharedspaceMemberList/SharedspaceMemberListModal')),
  [ModalName.JOINREQUEST_SENDER]: React.lazy(() => import('Components/modal/joinrequest/JoinRequestSenderModal')),
  [ModalName.JOINREQUEST_MANAGER]: React.lazy(() => import('Components/modal/joinrequest/JoinRequestManagerModal')),
  [ModalName.JOINREQUEST_DETAIL]: React.lazy(() => import('Components/modal/joinrequest/JoinRequestDetail')),
  [ModalName.IMAGE_VIEWER]: React.lazy(() => import('Components/modal/imageViewer/ImageViewer')),
};

const RenderModal: FC = () => {
  const modalStack = useAppSelector(state => state.modal);

  if (!modalStack.length) return null;

  return (
    modalStack.map((modal, i) => {
      const ModalComponent = modals[modal.name] as React.LazyExoticComponent<React.ComponentType<any>>;

      return (
        <ModalComponent { ...{ ...modal.props, idx: i } }/>
      );
    })
  );
};

export default RenderModal;