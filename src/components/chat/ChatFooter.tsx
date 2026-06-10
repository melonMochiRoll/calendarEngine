import React, { FC } from 'react';
import styled from '@emotion/styled';
import SendIcon from '@mui/icons-material/Send';
import AddCircleIcon from '@mui/icons-material/AddCircleRounded';
import AddPhotoIcon from '@mui/icons-material/AddPhotoAlternate';
import useMenu from 'Hooks/utils/useMenu';
import { CircularProgress, Menu, MenuItem } from '@mui/material';
import { muiMenuDarkModeSx } from 'Constants/notices';
import { SocketStatus } from 'Src/constants/constants';
import NetworkIcon from '@mui/icons-material/RssFeedRounded';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheckRounded';

interface ChatFooterProps {
  onSubmit: () => void,
  socketStatus: string,
  chat: string,
  onChangeChat: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onChangeImageFiles: (e: React.ChangeEvent<HTMLInputElement>) => void,
};

const ChatFooter: FC<ChatFooterProps> = ({
  onSubmit,
  socketStatus,
  chat,
  onChangeChat,
  onChangeImageFiles,
}) => {
  const {
    anchorEl,
    open,
    onOpen,
    onClose,
  } = useMenu();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  const displayStatus = (socketStatus: string) => {
    if (socketStatus === SocketStatus.CONNECTED) {
      return (
        <>
          <NetworkIcon sx={{ color: 'var(--naver-green)' }} />
          <IndicatorText color={'var(--naver-green)'}>{socketStatus}</IndicatorText>
        </>
      );
    }

    if (socketStatus === SocketStatus.RECONNECTING) {
      return (
        <>
          <CircularProgress sx={{ color: 'var(--orange)' }} size={20} />
          <IndicatorText color={'var(--orange)'}>{socketStatus}</IndicatorText>
        </>
      );
    }

    if (socketStatus === SocketStatus.DISCONNECTED) {
      return (
        <>
          <NetworkCheckIcon sx={{ color: 'var(--red)' }} />
          <IndicatorText color={'var(--red)'}>{socketStatus}</IndicatorText>
        </>
      );
    }

    return <></>;
  };

  return (
    <Footer>
      <Form onSubmit={handleSubmit}>
        <IconButton
          onClick={onOpen}
          type='button'>
          <AddCircleIcon fontSize='large' />
        </IconButton>
        <Input
          value={chat}
          onChange={onChangeChat}
          placeholder='메시지 보내기' />
        <IconButton type='submit'>
          <SendIcon fontSize='large' />
        </IconButton>
        {
          anchorEl &&
          <Menu
            aria-labelledby='demo-positioned-button'
            anchorEl={anchorEl}
            open={open}
            onClick={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            sx={muiMenuDarkModeSx}>
            <Label htmlFor='image-upload'>
              <MenuItem sx={{ gap: '5px' }}>
                <AddPhotoIcon />
                <span>이미지 업로드</span>
              </MenuItem>
            </Label>
          </Menu>
        }
        <InputImageFile
          onChange={onChangeImageFiles}
          id='image-upload'
          type='file'
          accept='image/*'
          multiple />
      </Form>
      <SocketIndicator>{displayStatus(socketStatus)}</SocketIndicator>
    </Footer>
  );
};

export default ChatFooter;

const Footer = styled.footer`
  padding: 0 20px;
`;

const Form = styled.form`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 15px;
  background-color: var(--light-gray);
  border-radius: 8px;
  gap: 10px;
`;

const Input = styled.input`
  width: 100%;
  color: var(--white);
  font-size: 20px;
  background-color: var(--light-gray);
  border: none;
  outline: none;
`;

const IconButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  color: var(--white);
  background-color: rgba(255, 255, 255, 0);
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Label = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  gap: 5px;
`;

const InputImageFile = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
`;

const SocketIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  gap: 7px;
`;

const IndicatorText = styled.span<{ color?: string }>`
  font-size: 18px;
  font-weight: 600;
  color: ${({color}) => color ? color : 'var(--white)'};
`;