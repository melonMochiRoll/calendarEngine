import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from 'Hooks/reduxHooks';
import { closeModal } from 'Features/modalSlice';
import { ModalName } from 'Typings/types';
import TodoDetail from './todo/TodoDetail';
import TodoUpdate from './todo/TodoUpdate';
import TodoInput from 'Components/modal/todo/TodoInput';
import SharedspaceManagerModal from './sharedspaceManager/SharedspaceManagerModal';
import SearchModal from './search/SearchModal';
import SharedspaceMemberListModal from './sharedspaceMemberList/SharedspaceMemberListModal';
import JoinRequestSenderModal from 'Components/modal/joinrequest/JoinRequestSenderModal';
import JoinRequestManagerModal from 'Components/modal/joinrequest/JoinRequestManagerModal';
import JoinRequestDetail from 'Components/modal/joinrequest/JoinRequestDetail';
import ImageViewer from './imageViewer/ImageViewer';

const modals = {
  [ModalName.SEARCH]: SearchModal,
  [ModalName.SHAREDSPACEMANAGER]: SharedspaceManagerModal,
  [ModalName.TODO_INPUT]: TodoInput,
  [ModalName.TODO_DETAIL]: TodoDetail,
  [ModalName.TODO_UPDATE]: TodoUpdate,
  [ModalName.SHAREDSPACEMEMBERLIST]: SharedspaceMemberListModal,
  [ModalName.JOINREQUEST_SENDER]: JoinRequestSenderModal,
  [ModalName.JOINREQUEST_MANAGER]: JoinRequestManagerModal,
  [ModalName.JOINREQUEST_DETAIL]: JoinRequestDetail,
  [ModalName.IMAGE_VIEWER]: ImageViewer,
};

const RenderModal: FC = () => {
  const dispatch = useAppDispatch();
  const modalStack = useAppSelector(state => state.modal);

  if (!modalStack.length) return null;

  return (
    modalStack.map((modal, i) => {
      const ModalComponent = modals[modal.name] as React.ComponentType<any>;

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