import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { closeModal } from 'Src/features/modalSlice';
import { createSharedspaceChatRoom } from 'Src/api/chatroomsApi';
import { toast } from 'react-toastify';
import { defaultToastOption, requiredFieldMessage, successMessage, waitingMessage } from 'Src/constants/notices';
import { CircularProgress } from '@mui/material';
import { GET_SHAREDSPACE_KEY } from 'Src/constants/queryKeys';
import { useQueryClient } from '@tanstack/react-query';

interface ChatRoomCreaterMainProps {
  SharedspaceId: string,
};

const ChatRoomCreaterMain: FC<ChatRoomCreaterMainProps> = ({ SharedspaceId }) => {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  const [ name, setName ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState('');

  const onSubmit = async (
    SharedspaceId: string,
    name: string,
  ) => {
    if (!name) {
      setError(requiredFieldMessage);
      return;
    }

    setIsLoading(true);

    try {
      await createSharedspaceChatRoom(SharedspaceId, name);
      
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
          onClick={() => onSubmit(SharedspaceId, name)}
          bgColor='var(--google-blue)'>
            {
            isLoading ?
              <CircularProgress size={25} sx={{ color: 'var(--white)' }}/> :
              '채팅방 만들기'
            }
        </Button>
      </Buttons>
    </Main>
  );
};

export default ChatRoomCreaterMain;

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