import React, { FC } from 'react';
import styled from '@emotion/styled';
import { PATHS } from "Src/constants/paths";
import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import MenuButton from 'Src/components/common/MenuButton';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import { FallbackProps, useErrorBoundary } from 'react-error-boundary';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';

interface ModalFallbackProps {
  errorProps: FallbackProps,
};

const ModalFallback: FC<ModalFallbackProps> = ({
  errorProps,
}) => {
  const { url } = useParams();
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
    <Main>
      <ErrorIcon sx={ErrorInlineStyle} />
      <NotFoundMessage>문제가 발생했습니다. 잠시후 다시 시도해 주세요</NotFoundMessage>
      <ButtonBox>
        <MenuButton
          type='button'
          bgColor='var(--naver-green)'
          onClick={() => navigate(`${PATHS.SHAREDSPACE}/view/${url}`)}>
            <HomeIcon />
            스페이스 홈으로
        </MenuButton>
        <MenuButton
          type='button'
          bgColor='var(--red)'
          onClick={() => refetch()}>
            <RefreshIcon />
            재시도
        </MenuButton>
      </ButtonBox>
    </Main>
  );
}

export default ModalFallback;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 85%;
  padding-bottom: 15px;
  color: var(--white);
`;

const ErrorInlineStyle = {
  color: 'var(--white)',
  fontSize: '64px',
  paddingBottom: '15px',
};

const NotFoundMessage = styled.span`
  color: var(--white);
  font-size: 20px;
  font-weight: 600;
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
  gap: 25px;
`;