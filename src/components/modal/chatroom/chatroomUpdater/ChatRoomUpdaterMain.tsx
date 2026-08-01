import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { closeModal } from 'Src/features/modalSlice';
import { CircularProgress } from '@mui/material';
import { updateSharedspaceChatRoomName } from 'Src/api/chatroomsApi';
import { toast } from 'react-toastify';
import { defaultToastOption, successMessage, waitingMessage } from 'Src/constants/notices';
import { GET_SHAREDSPACE_KEY } from 'Src/constants/queryKeys';

interface ChatRoomUpdaterMainProps {
  SharedspaceId: string,
  ChatRoomId: string,
  prevName: string,
};

const ChatRoomUpdaterMain: FC<ChatRoomUpdaterMainProps> = ({
  SharedspaceId,
  ChatRoomId,
  prevName,
}) => {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  const [ name, setName ] = useState(prevName);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState('');

  const onSubmit = async (
    SharedspaceId: string,
    ChatRoomId: string,
    prevName: string,
    name: string,
  ) => {
    if (prevName === name) {
      return;
    }

    setIsLoading(true);

    try {
      await updateSharedspaceChatRoomName(SharedspaceId, ChatRoomId, name);

      toast.success(successMessage, defaultToastOption);
      await qc.refetchQueries([GET_SHAREDSPACE_KEY, SharedspaceId]);
      dispatch(closeModal());
    } catch (err) {
      setError(waitingMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Main>
      <Label>
        채널 이름
        <Input
          autoFocus
          id='name'
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='일반' />
        <ErrorText>{error}</ErrorText>
      </Label>
      <Buttons>
        <Button
          onClick={() => dispatch(closeModal())}>
            취소
        </Button>
        <Button
          onClick={() => onSubmit(SharedspaceId, ChatRoomId, prevName, name)}
          bgColor='var(--google-blue)'>
            {
            isLoading ?
              <CircularProgress size={25} sx={{ color: 'var(--white)' }}/> :
              '수정 완료'
            }
        </Button>
      </Buttons>
    </Main>
  );
};

export default ChatRoomUpdaterMain;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 85%;
  padding: 20px;
  gap: 25px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  color: var(--white);
  font-size: 20px;
  font-weight: 600;
  gap: 10px;
`;

const Input = styled.input`
  width: 100%;
  height: 50px;
  padding: 0 20px;
  color: var(--white);
  font-size: 24px;
  border: 2px solid var(--google-blue);
  border-radius: 8px;
  background-color: var(--black);
  outline: none;
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