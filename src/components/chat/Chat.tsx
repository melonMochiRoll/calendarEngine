import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { TChatList } from 'Typings/types';
import ProfileImage from 'Components/ProfileImage';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import MoreIcon from '@mui/icons-material/MoreHoriz';
import useMenu from 'Hooks/useMenu';
import { defaultToastOption, muiMenuDarkModeSx, waitingMessage } from 'Constants/notices';
import { Menu, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import { useParams } from 'react-router-dom';
import { deleteSharedspaceChat, updateSharedspaceChat } from 'Api/sharedspacesApi';
import EditIcon from '@mui/icons-material/Edit';
import useInput from 'Hooks/utils/useInput';
import EditContent from './EditContent';
import SingleImage from './SingleImage';
import MultipleImage from './MultipleImage';
import useUser from 'Hooks/useUser';
import { toast } from 'react-toastify';

interface ChatProps {
  chat: TChatList,
};

const Chat: FC<ChatProps> = ({
  chat,
}) => {
  const { url } = useParams();
  const { data: userData } = useUser({ suspense: false, throwOnError: false });
  const [ isEditMode, setIsEditMode ] = useState(false);
  const [ newContent, onChangeNewContent ] = useInput(chat.content);
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const localTimeZone = dayjs.tz.guess();

  const {
    anchorEl,
    open,
    onOpen,
    onClose,
  } = useMenu();

  const hoverMenuId = 'hoverMenu';
  const isUpdated = chat.createdAt !== chat.updatedAt;

  const onUpdateChat = (
    url: string | undefined,
    ChatId: number,
    oldContent: string,
    newContent: string,
  ) => {
    if (!url) {
      return;
    }

    updateSharedspaceChat(url, ChatId, oldContent, newContent.trim())
      .catch(() => {
        toast.error(waitingMessage, {
          ...defaultToastOption,
        });
      });
  };

  const onDeleteChat = (url: string | undefined, chatId: number) => {
    if (!url) {
      return;
    }

    deleteSharedspaceChat(url, chatId)
      .catch(() => {
        toast.error(waitingMessage, {
          ...defaultToastOption,
        });
      });
  };

  return (
    <Item hoverMenuId={hoverMenuId}>
      <ProfileWrapper>
        <ProfileImage
          profileImage={chat.Sender.profileImage}
          email={chat.Sender.email}
          size={'large'} />
      </ProfileWrapper>
      <ChatWrapper>
        <InfoWrapper>
          <ProfileName>{chat.Sender.email}</ProfileName>
          <Timestamp>{dayjs(chat.createdAt).tz(localTimeZone).format('A hh:mm')}</Timestamp>
          {isUpdated && <UpdatedSpan>수정됨</UpdatedSpan>}
        </InfoWrapper>
        <ContentWrapper>
          {isEditMode ?
            <EditContent
              onClose={() => setIsEditMode(false)}
              content={newContent}
              onChangeContent={onChangeNewContent}
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateChat(url, chat.id, chat.content, newContent);
                setIsEditMode(false);
              }} /> :
            <Content>{chat.content}</Content>
          }
          <Images>
            {
              chat.Images.map((image) => {
                if (chat.Images.length === 1) {
                  return <SingleImage
                    key={image.id}
                    image={image} />
                }

                return <MultipleImage
                  key={image.id}
                  isSender={chat.SenderId === userData?.id}
                  ChatId={chat.id}
                  image={image} />
              })
            }
          </Images>
        </ContentWrapper>
      </ChatWrapper>
      {chat.SenderId === userData?.id &&
        <HoverMenu id={hoverMenuId}>
          <IconWrapper onClick={onOpen}>
            <MoreIcon fontSize='large' />
          </IconWrapper>
        </HoverMenu>
      }
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
            onClick={() => onDeleteChat(url, chat.id)}
            sx={{ gap: '5px', color: 'var(--red)' }}>
            <DeleteIcon />
            <span>메시지 삭제</span>
          </MenuItem>
      </Menu>
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
  align-items: flex-end;
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