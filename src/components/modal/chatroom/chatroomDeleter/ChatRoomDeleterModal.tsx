import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { closeModal } from 'Src/features/modalSlice';
import { CircularProgress } from '@mui/material';
import { deleteSharedspaceChatRoom } from 'Src/api/chatroomsApi';
import { waitingMessage } from 'Src/constants/notices';
import { GET_SHAREDSPACE_KEY } from 'Src/constants/queryKeys';

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
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState('');

  const handleDeleteChatRoom = async (SharedspaceId: string, ChatRoomId: string) => {
    setIsLoading(true);

    try {
      await deleteSharedspaceChatRoom(SharedspaceId, ChatRoomId);
      await qc.refetchQueries([GET_SHAREDSPACE_KEY, SharedspaceId]);
      dispatch(closeModal());
    } catch (err) {
      setError(waitingMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Block onClick={e => e.stopPropagation()}>
      <Texts>
        <Title>채팅방 삭제</Title>
        <Description>
          {`${ChatRoomName} 채팅방을 삭제하시겠습니까? 삭제하면 되돌릴 수 없습니다.`}
        </Description>
        <ErrorText>{error}</ErrorText>
      </Texts>
      <Buttons>
        <Button
          onClick={() => dispatch(closeModal())}>
            취소
        </Button>
        <Button
          onClick={() => handleDeleteChatRoom(SharedspaceId, ChatRoomId)}
          bgColor='var(--red)'>
            {
            isLoading ?
              <CircularProgress size={25} sx={{ color: 'var(--white)' }}/> :
              '채팅방 삭제하기'
            }
        </Button>
      </Buttons>
    </Block>
  );
};

export default ChatRoomDeleterModal;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 500px;
  height: 200px;
  padding: 25px;
  border: 1px solid #1d2126;
  border-radius: 15px;
  background-color: var(--black);
  box-shadow: 1px 1px 10px 2px #000;
`;

const Texts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Title = styled.h2`
  color: var(--white);
  font-size: 28px;
  font-weight: 800;
  margin: 0;
`;

const Description = styled.span`
  color: var(--gray-6);
  font-size: 18px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 15px;
`;

const Button = styled.button<{ bgColor?: string }>`
  width: 100%;
  height: 50px;
  color: var(--white);
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background-color: ${({ bgColor }) => bgColor ? bgColor : 'var(--gray-8)'};
  cursor: pointer;

  &:hover {
    filter: brightness(1.1);
  }
`;

const ErrorText = styled.span`
  color: var(--red);
  font-size: 18px;
  font-weight: 400;
`;