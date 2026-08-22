import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { closeModal } from 'Src/features/modalSlice';
import { CircularProgress } from '@mui/material';
import { waitingMessage } from 'Src/constants/notices';

export interface ConfirmModalProps {
  title: string,
  message: string,
  confirmText: string,
  onConfirm: () => Promise<void>,
  variant?: 'info' | 'warning',
};

const ConfirmModal: FC<ConfirmModalProps> = ({
  title,
  message,
  confirmText,
  onConfirm,
  variant = 'info',
}) => {
  const dispatch = useAppDispatch();
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState('');

  const ConfirmButtonBgColor = {
    info: 'var(--google-blue)',
    warning: 'var(--red)',
  };

  const handleConfirm = async (onConfirm: () => Promise<void>) => {
    setIsLoading(true);

    try {
      await onConfirm();
    } catch (err) {
      setError(waitingMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Block onClick={e => e.stopPropagation()}>
      <Texts>
        <Title>{title}</Title>
        <Description>
          {message}
        </Description>
        <ErrorText>{error}</ErrorText>
      </Texts>
      <Buttons>
        <Button
          onClick={() => dispatch(closeModal())}>
            취소
        </Button>
        <Button
          onClick={() => handleConfirm(onConfirm)}
          bgColor={ConfirmButtonBgColor[variant]}>
            {
            isLoading ?
              <CircularProgress size={25} sx={{ color: 'var(--white)' }}/> :
              confirmText
            }
        </Button>
      </Buttons>
    </Block>
  );
};

export default ConfirmModal;

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