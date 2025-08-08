import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from 'Hooks/reduxHooks';
import { closeModal } from 'Features/modalSlice';
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
  const dispatch = useAppDispatch();
  const modalStack = useAppSelector(state => state.modal);

  if (!modalStack.length) return null;

  return (
    modalStack.map((modal, i) => {
      const ModalComponent = modals[modal.name] as React.LazyExoticComponent<React.ComponentType<any>>;

      return (
        <Backdrop
          key={modal.name + i}
          zIndex={100 + i}
          isBottom={!i}
          onClick={() => dispatch(closeModal())}>
          <ModalComponent {...modal.props}/>
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