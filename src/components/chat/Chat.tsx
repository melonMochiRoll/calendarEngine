import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { ChatStatus, TChatPayload } from 'Typings/types';
import ProfileAvatar from 'Src/components/ProfileAvatar';
import dayjs from 'dayjs';
import MoreIcon from '@mui/icons-material/MoreHoriz';
import useMenu from 'Hooks/utils/useMenu';
import { muiMenuDarkModeSx } from 'Constants/notices';
import { CircularProgress, Menu, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import { useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import useInput from 'Hooks/utils/useInput';
import EditContent from './EditContent';
import ChatImage from './ChatImage';
import RetryIcon from '@mui/icons-material/Replay';
import CrossIcon from '@mui/icons-material/Clear';

interface ChatProps {
  idx: number,
  chat: TChatPayload,
  updateSharedspaceChat: (url: string | undefined, ChatId: string, oldContent: string, newContent: string) => void,
  deleteSharedspaceChat: (url: string | undefined, ChatId: string) => void,
  deleteSharedspaceChatImage: (url: string | undefined, ChatId: string, ImageId: string) => void,
  deleteErrorChat: (url: string | undefined, idx: number) => void,
  reSubmit: (url: string | undefined, chat: TChatPayload, idx: number) => void,
};

const Chat: FC<ChatProps> = ({
  idx,
  chat,
  updateSharedspaceChat,
  deleteSharedspaceChat,
  deleteSharedspaceChatImage,
  deleteErrorChat,
  reSubmit,
}) => {
  const { url } = useParams();
  const [ isEditMode, setIsEditMode ] = useState(false);
  const [ newContent, onChangeNewContent ] = useInput(chat.content);
  const localTimeZone = dayjs.tz.guess();

  const {
    anchorEl,
    open,
    onOpen,
    onClose,
  } = useMenu();

  const hoverMenuId = 'hoverMenu';
  const isUpdated = chat.createdAt !== chat.updatedAt;
  const isPending = chat._status === ChatStatus.PENDING;
  const isError = chat._status === ChatStatus.ERROR;
  const isEditable = !isPending && !isError && chat.permission.isSender;

  return (
    <Item hoverMenuId={hoverMenuId}>
      <ProfileWrapper>
        <ProfileAvatar
          ProfileImage={chat.Sender.ProfileImage}
          email={chat.Sender.email}
          size={'large'} />
      </ProfileWrapper>
      <ChatWrapper>
        <InfoWrapper>
          <ProfileName>{chat.Sender.nickname}</ProfileName>
          <Timestamp>{dayjs(chat.createdAt).tz(localTimeZone).format('A hh:mm')}</Timestamp>
          {isUpdated && <UpdatedSpan>수정됨</UpdatedSpan>}
          {isPending && <CircularProgress size={15} sx={{ color: 'var(--white)' }}/>}
          {isError &&
            <ErrorWrapper>
              <CrossIcon fontSize='small' onClick={() => deleteErrorChat(url, idx)} />
              :
              <RetryIcon fontSize="small" onClick={() => reSubmit(url, chat, idx)} />
            </ErrorWrapper>
          }
        </InfoWrapper>
        <ContentWrapper>
          {isEditMode ?
            <EditContent
              onClose={() => setIsEditMode(false)}
              content={newContent}
              onChangeContent={onChangeNewContent}
              onSubmit={e => {
                e.preventDefault();
                updateSharedspaceChat(url, chat.id, chat.content, newContent);
                setIsEditMode(false);
              }} /> :
            <Content>{chat.content}</Content>
          }
          {
            chat.ChatImages &&
              <Images>
                {
                  chat.ChatImages.map((image) => {
                    return <ChatImage
                      key={image.id}
                      image={image}
                      isSender={chat.permission.isSender}
                      deleteImage={() => deleteSharedspaceChatImage(url, chat.id, image.id)} />
                  })
                }
              </Images>
          }
        </ContentWrapper>
      </ChatWrapper>
      {isEditable &&
        <HoverMenu id={hoverMenuId}>
          <IconWrapper onClick={onOpen}>
            <MoreIcon fontSize='large' />
          </IconWrapper>
        </HoverMenu>
      }
      {
        anchorEl &&
        <Menu
          aria-labelledby='demo-positioned-button'
          anchorEl={anchorEl}
          open={open}
          onClick={onClose}
          anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
          transformOrigin={{ vertical: 'center', horizontal: 'right' }}
          sx={muiMenuDarkModeSx}>
            <MenuItem
              onClick={() => setIsEditMode(true)}
              sx={{ gap: '5px', color: 'var(--gray-3)' }}>
              <EditIcon />
              <span>메시지 수정</span>
            </MenuItem>
            <MenuItem
              onClick={() => deleteSharedspaceChat(url, chat.id)}
              sx={{ gap: '5px', color: 'var(--red)' }}>
              <DeleteIcon />
              <span>메시지 삭제</span>
            </MenuItem>
        </Menu>
      }
    </Item>
  );
};

export default Chat;

const Item = styled.li<{ hoverMenuId?: string }>`
  position: relative;
  display: flex;
  padding: 5px 20px;
  gap: 15px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);

    #${({hoverMenuId}) => hoverMenuId} {
      visibility: visible;
    }
  }
`;

const ProfileWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 5px;
`;

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  gap: 10px;
`;

const ProfileName = styled.span`
  color: var(--white);
  font-size: 20px;
  font-weight: 600;
`;

const Timestamp = styled.span`
  color: var(--gray-5);
  font-size: 16px;
`;

const Content = styled.p`
  width: 100%;
  color: var(--white);
  font-size: 18px;
  font-weight: 500;
  padding: 0;
  margin: 0;
  white-space: normal;
  word-wrap: break-word;
  word-break: normal;
  overflow-y: auto;
`;

const Images = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 5px;
`;

const HoverMenu = styled.div`
  position: absolute;
  visibility: hidden;
  top: 0;
  right: 0;
  padding: 10px;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--gray-3);
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const UpdatedSpan = styled.span`
  color: var(--gray-6);
  font-size: 14px;
  padding-bottom: 1px;
`;

const ErrorWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--white);
  border-radius: 6px;
  padding: 1px 3px;
  background-color: var(--red);
  gap: 3px;
  user-select: none;

  svg {
    cursor: pointer;
  }
`;