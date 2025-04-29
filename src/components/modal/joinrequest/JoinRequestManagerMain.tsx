import React, { FC } from 'react';
import styled from '@emotion/styled';
import useJoinRequest from 'Hooks/useJoinRequest';
import { TJoinRequest } from 'Typings/types';
import JoinRequestItem from './JoinRequestItem';

const JoinRequestManagerMain: FC = () => {
  const { data: joinRequestsData } = useJoinRequest({ suspense: true, throwOnError: true });

  return (
    <Main>
      <List>
        {joinRequestsData.map((request: TJoinRequest) => {
          return (
            <JoinRequestItem
              key={request.id}
              request={request}/>
          );
        })}
      </List>
    </Main>
  );
};

export default JoinRequestManagerMain;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 85%;
  color: var(--white);
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0;
  padding-bottom: 1%;
  margin: 0;
  overflow-y: auto;
`;