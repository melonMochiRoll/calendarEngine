import React, { FC } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { closeModal } from 'Src/features/modalSlice';
import { deleteSharedspaceChatRoom } from 'Src/api/chatroomsApi';
import { GET_SHAREDSPACE_KEY } from 'Src/constants/queryKeys';
import ConfirmModal from '../../common/ConfirmModal';

export interface ChatRoomDeleterModalProps {
  SharedspaceId: string,
  ChatRoomId: string,
  ChatRoomName: string,
};

const ChatRoomDeleterModal: FC<ChatRoomDeleterModalProps> = ({
  SharedspaceId,
  ChatRoomId,
  ChatRoomName,
}) => {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();

  const handleDeleteChatRoom = async (SharedspaceId: string, ChatRoomId: string) => {
    await deleteSharedspaceChatRoom(SharedspaceId, ChatRoomId);
    await qc.refetchQueries([GET_SHAREDSPACE_KEY, SharedspaceId]);
    dispatch(closeModal());
  };

  return (
    <ConfirmModal
      title='채팅방 삭제'
      message={`${ChatRoomName} 채팅방을 삭제하시겠습니까? 삭제하면 되돌릴 수 없습니다.`}
      confirmText='채팅방 삭제하기'
      onConfirm={() => handleDeleteChatRoom(SharedspaceId, ChatRoomId)}
      variant = 'warning' />
  );
};

export default ChatRoomDeleterModal;