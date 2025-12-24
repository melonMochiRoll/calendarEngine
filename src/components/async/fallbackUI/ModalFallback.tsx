import React from 'react';
import styled from '@emotion/styled';
import { PATHS } from "Src/constants/paths";
import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import MenuButton from 'Src/components/common/MenuButton';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import { FallbackProps } from 'react-error-boundary';
import CloseIcon from '@mui/icons-material/CloseRounded';
import MailIcon from '@mui/icons-material/Mail';

export default function ModalFallback(
  { error, resetErrorBoundary }: FallbackProps,
  idx: number,
  title: string,
  handleClose: () => void,
  url: string | undefined,
  removeQueries?: () => void,
) {
  function onClose() {
    handleClose();
    resetErrorBoundary();

    if (removeQueries) {
      removeQueries();
    }
  }

  return (
    <Backdrop
      zIndex={100 + idx}
      isBottom={!idx}
      onClick={onClose}>
      <Block>
        <Header>
          <Left></Left>
          <Center>
            <MailIcon fontSize='large' />
            <ModalTitle>{title}</ModalTitle>
          </Center>
          <Right>
            <CloseIcon
              onClick={onClose}
              sx={CloseIconInlineStyle} />
          </Right>
        </Header>
        <Main>
          <ErrorIcon sx={ErrorInlineStyle} />
          <NotFoundMessage>문제가 발생했습니다. 잠시후 다시 시도해 주세요</NotFoundMessage>
            <ButtonBox>
              <MenuButton
                type='button'
                bgColor='var(--naver-green)'
                onClick={() => window.location.href = `${PATHS.SHAREDSPACE}/view/${url}`}>
                  <HomeIcon />
                  스페이스 홈으로
              </MenuButton>
              <MenuButton
                type='button'
                bgColor='var(--red)'
                onClick={onClose}>
                  <RefreshIcon />
                  창 닫기
              </MenuButton>
            </ButtonBox>
          </Main>
      </Block>
    </Backdrop>
  );
}

const Backdrop = styled.div<{ zIndex: number, isBottom: boolean }>`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ isBottom }) => isBottom ? 'rgba(0, 0, 0, 0.8)' : ''};
  z-index: ${({ zIndex }) => zIndex};
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 650px;
  height: 500px;
  border-radius: 15px;
  background-color: var(--black);
  box-shadow: 1px 1px 10px 2px #000;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 15%;
  padding: 20px 0;
  border-bottom: 1px solid var(--light-gray);
`;

const Left = styled.div`
  width: 15%;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--white);
  width: 70%;
  gap: 15px;
`;

const ModalTitle = styled.h1`
  color: var(--white);
  font-size: 24px;
  font-weight 600;
  margin: 0;
`;

const Right = styled.div`
  display: flex;
  justify-content: center;
  width: 15%;
`;

const CloseIconInlineStyle = {
  color: 'var(--white)',
  fontSize: '35px',
  cursor: 'pointer',
};

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