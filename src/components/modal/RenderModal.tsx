import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from 'Hooks/reduxHooks';
import SearchModal from 'Components/modal/search/SearchModal';
import SharedspaceManagerModal from 'Components/modal/sharedspaceManager/SharedspaceManagerModal';
import { closeModal } from 'Features/modalSlice';
import { TModals } from 'Typings/types';
import TodoDetail from './todo/TodoDetail';
import TodoInput from './todo/TodoInput';
import SharedspaceMemberListModal from './sharedspaceMemberList/SharedspaceMemberListModal';
import JoinRequestSender from './joinrequest/JoinRequestSender';
import JoinRequestManager from './joinrequest/JoinRequestManager';
import ImageViewer from './imageViewer/ImageViewer';

const Modals: TModals = {
  SEARCH: <SearchModal />,
  SHAREDSPACEMANAGER: <SharedspaceManagerModal />,
  TODO_INPUT: <TodoInput />,
  TODO_DETAIL: <TodoDetail />,
  SHAREDSPACEMEMBERLIST: <SharedspaceMemberListModal />,
  JOINREQUEST_SENDER: <JoinRequestSender />,
  JOINREQUEST_MANAGER: <JoinRequestManager />,
  IMAGE_VIEWER: <ImageViewer />,
  CLOSE: null,
};

const RenderModal: FC = () => {
  const { modalName } = useAppSelector(state => state.modal);
  const dispatch = useAppDispatch();
  if (!modalName || !Modals.hasOwnProperty(modalName)) return;

  const renderModal = () => {
    return Modals[modalName];
  };

  return (
    <Block
      onClick={() => dispatch(closeModal())}>
      {renderModal()}
    </Block>
  );
};

export default RenderModal;

const Block = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 2;
`;