import React, { FC } from 'react';
import styled from '@emotion/styled';
import { PATHS } from "Src/constants/paths";
import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import MenuButton from 'Src/components/common/MenuButton';
import { FallbackProps, useErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';

interface SharedspaceFallbackProps {
  errorProps: FallbackProps,
};

const SharedspaceFallback: FC<SharedspaceFallbackProps> = ({
  errorProps,
}) => {
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
    <Background>
      <Block>
        <NoticeBox>
          <Notice>문제가 발생했습니다. 잠시후 다시 시도해 주세요</Notice>
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
    </Background>
  );
};

export default SharedspaceFallback;

const Background = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: var(--black);
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const NoticeBox = styled.div`
  display: flex;
  flex-direction: column;
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