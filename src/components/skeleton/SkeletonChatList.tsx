import React, { FC } from 'react';
import styled from '@emotion/styled';
import SkeletonChat from './SkeletonChat';

const SkeletonChatList: FC = () => {
  const skeleton = [
    {
      email: 120,
      content: 200,
    },
    {
      email: 110,
      content: 120,
    },
    {
      email: 130,
      content: 250,
    },
    {
      email: 180,
      content: 350,
    },
    {
      email: 140,
      content: 150,
    },
    {
      email: 130,
      content: 320,
    },
    {
      email: 140,
      content: 100,
    },
    {
      email: 120,
      content: 220,
    },
  ];

  return (
    <ChatBlock>
      <ChatWrapper>
        <List>
        {
          skeleton.map((v: typeof skeleton[0], idx: number) => {
            return <SkeletonChat
              key={idx}
              email={v.email}
              content={v.content} />
          })
        }
        </List>
      </ChatWrapper>
    </ChatBlock>
  );
};

export default SkeletonChatList;

const ChatBlock = styled.div`
  display: flex;
  justify-content: center;
  width: 70%;
`;

const ChatWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 1000px;
  height: 100%;
  background-color: var(--dark-gray);
`;

const List = styled.ul`
  display: flex;
  flex-direction: column-reverse;
  width: 100%;
  height: 80%;
  padding: 0;
  padding-bottom: 30px;
  margin: 0;
  gap: 20px;
  overflow-y: scroll;
`;