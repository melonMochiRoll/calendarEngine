import React, { FC } from 'react';
import styled from '@emotion/styled';
import { FallbackProps, useErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import RefreshIcon from '@mui/icons-material/Refresh';

interface DmChatRoomListFallbackFallbackProps {
  errorProps: FallbackProps,
};

const DmChatRoomListFallback: FC<DmChatRoomListFallbackFallbackProps> = ({ errorProps }) => {
  const { showBoundary } = useErrorBoundary();
  const { error, resetErrorBoundary } = errorProps;
  const { reset } = useQueryErrorResetBoundary();

  if (
    !error?.request || (
    error?.response?.status === 401 ||
    error?.response?.status === 403 ||
    error?.response?.status === 404 ||
    (error?.response?.status >= 500 && error?.response?.status < 600))
  ) {
    showBoundary(error);
    return <></>;
  }

  function refetch() {
    resetErrorBoundary();
    reset();
  }

  return (
    <Block>
      <Notice>문제가 발생했습니다.</Notice>
      <Notice>잠시후 다시 시도해 주세요</Notice>
      <Button onClick={() => refetch()}>
        <RefreshIcon />
      </Button>
    </Block>
  );
};

export default DmChatRoomListFallback;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px 20px;
  gap: 10px;
`;

const Notice = styled.span`
  color: var(--gray-6);
  font-size: 16px;
  font-weight: 600;
`;

const Button = styled.button`
  background-color: rgba(0, 0, 0, 0);
  border: none;
  cursor: pointer;

  svg {
    font-size: 45px;
    color: var(--gray-6);

    &:hover {
      color: var(--gray-4);
    }
  }
`;