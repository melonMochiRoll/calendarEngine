import React, { FC } from 'react';
import styled from '@emotion/styled';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownwardRounded';
import ProfileImage from 'Components/ProfileImage';

interface NewChatNotifierProps {
  newChat: {
    chat: string,
    email: string,
    nickname: string,
    profileImage: string,
  },
  onClick: () => void,
};

const NewChatNotifier: FC<NewChatNotifierProps> = ({
  newChat,
  onClick,
}) => {
  const { chat, email, nickname, profileImage } = newChat;

  return (
    <Block onClick={onClick}>
      <ProfileImage
        size='small'
        email={email} 
        profileImage={profileImage} />
      <Nickname>{nickname}</Nickname>
      {chat.length > 15 ?
        <Content>{`${chat?.slice(0, 15)}...`}</Content> :
        <Content>{chat}</Content>
      }
      <ArrowDownwardIcon
        onClick={onClick}
        sx={{ color: 'var(--white)' }} />
    </Block>
  );
};

export default NewChatNotifier;

const Block = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 50%;
  top: 0;
  padding: 7px 10px;
  margin-top: 50px;
  border-radius: 10px;
  transform: translate(-50%, -50%);
  background-color: var(--gray-7);
  cursor: pointer;
  gap: 10px;
  z-index: 1;
`;

const Nickname = styled.span`
  color: var(--white);
  font-size: 16px;
  font-weight: 600;
`;

const Content = styled.span`
  color: var(--white);
  text-align: center;
`;