import React, { FC } from 'react';
import styled from '@emotion/styled';
import { FallbackProps, useErrorBoundary } from 'react-error-boundary';
import MenuButton from 'Src/components/common/MenuButton';
import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { PATHS } from 'Src/constants/paths';
import ErrorIcon from '@mui/icons-material/ErrorOutline';

interface TodoFallbackProps {
  errorProps: FallbackProps,
};

const TodoFallback: FC<TodoFallbackProps> = ({ errorProps }) => {
  const navigate = useNavigate();
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
      <NoticeBox>
        <ErrorIcon sx={ErrorInlineStyle} />
        <ButtonBox>
          <MenuButton
            type='button'
            bgColor='var(--naver-green)'
            onClick={() => {
              navigate(PATHS.SHAREDSPACE);
              resetErrorBoundary();
            }}>
              <HomeIcon />
              홈으로
          </MenuButton>
          <MenuButton
            type='button'
            bgColor='var(--red)'
            onClick={() => refetch()}>
              <RefreshIcon />
              재시도
          </MenuButton>
        </ButtonBox>
      </NoticeBox>
    </Block>
  );
};

export default TodoFallback;

const Block = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const NoticeBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 70px;
`;

const Notice = styled.span`
  color: var(--white);
  font-size: 24px;
  font-weight: 600;
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
  gap: 25px;
`;

const ErrorInlineStyle = {
  color: 'var(--white)',
  fontSize: '128px',
  paddingBottom: '15px',
};