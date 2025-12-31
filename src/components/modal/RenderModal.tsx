import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from 'Hooks/reduxHooks';
import { ModalName } from 'Typings/types';
import { closeModal } from 'Src/features/modalSlice';

export const modals = {
  [ModalName.SEARCH]: React.lazy(() => import('Components/modal/search/SearchModal')),
  [ModalName.SHAREDSPACEMANAGER]: React.lazy(() => import('Components/modal/sharedspaceManager/SharedspaceManagerModal')),
  [ModalName.TODO_INPUT]: React.lazy(() => import('Components/modal/todo/TodoInput')),
  [ModalName.TODO_DETAIL]: React.lazy(() => import('Components/modal/todo/TodoDetail')),
  [ModalName.TODO_UPDATE]: React.lazy(() => import('Components/modal/todo/TodoUpdate')),
  [ModalName.SHAREDSPACEMEMBERLIST]: React.lazy(() => import('Components/modal/sharedspaceMemberList/SharedspaceMemberListModal')),
  [ModalName.JOINREQUEST_SENDER]: React.lazy(() => import('Components/modal/joinrequest/joinrequestSender/JoinRequestSenderModal')),
  [ModalName.JOINREQUEST_MANAGER]: React.lazy(() => import('Components/modal/joinrequest/joinrequestManager/JoinRequestManagerModal')),
  [ModalName.JOINREQUEST_DETAIL]: React.lazy(() => import('Components/modal/joinrequest/joinrequestManager/JoinRequestDetail')),
  [ModalName.IMAGE_VIEWER]: React.lazy(() => import('Components/modal/imageViewer/ImageViewer')),
};

const RenderModal: FC = () => {
  const dispatch = useAppDispatch();
  const modalStack = useAppSelector(state => state.modal);

  if (!modalStack.length) return null;

  function onClose() {
    dispatch(closeModal());
  }

  return (
    modalStack.map((modal, idx) => {
      const ModalComponent = modals[modal.name] as React.LazyExoticComponent<React.ComponentType<any>>;

      return (
        <Backdrop
          key={modal.name}
          zIndex={100 + idx}
          isBottom={!idx}
          onClick={onClose}>
          <ModalComponent { ...modal.props } />
        </Backdrop>
      );
    })
  );
};

export default RenderModal;

const Backdrop = styled.div<{ zIndex: number, isBottom: boolean }>`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ isBottom }) => isBottom ? 'rgba(0, 0, 0, 0.8)' : ''};
  z-index: ${({ zIndex }) => zIndex};
`;