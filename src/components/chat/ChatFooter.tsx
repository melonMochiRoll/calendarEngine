import React, { FC } from 'react';
import styled from '@emotion/styled';
import SendIcon from '@mui/icons-material/Send';
import AddCircleIcon from '@mui/icons-material/AddCircleRounded';
import AddPhotoIcon from '@mui/icons-material/AddPhotoAlternate';
import useMenu from 'Hooks/useMenu';
import { Menu, MenuItem } from '@mui/material';
import { muiMenuDarkModeSx } from 'Constants/notices';

interface ChatFooterProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  chat: string;
  onChangeChat: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeImageFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ChatFooter: FC<ChatFooterProps> = ({
  onSubmit,
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

  return (
    <Footer>
      <Form onSubmit={onSubmit}>
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
        <InputImageFile
          onChange={onChangeImageFiles}
          id='image-upload'
          type='file'
          accept='image/*'
          multiple />
      </Form>
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