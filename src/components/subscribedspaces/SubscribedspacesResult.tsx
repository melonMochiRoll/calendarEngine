import React, { FC } from 'react';
import styled from '@emotion/styled';
import { TSubscribedspaces } from 'Typings/types';
import SubscribedspacesItem from './SubscribedspacesItem';
import { emptyspaces } from 'Lib/noticeConstants';
import { deleteSharedspace } from 'Api/sharedspacesApi';
import { useQueryClient } from '@tanstack/react-query';
import { GET_SUBSCRIBED_SPACES_KEY } from 'Lib/queryKeys';

interface SubscribedSpacesResultProps {
  subscribedspaceData: TSubscribedspaces[];
};

const SubscribedSpacesResult: FC<SubscribedSpacesResultProps> = ({
  subscribedspaceData,
}) => {
  const qc = useQueryClient();

  const onDeleteSharedspace = async (url: string) => {
    await deleteSharedspace(url);
    await qc.refetchQueries([GET_SUBSCRIBED_SPACES_KEY]);
  };
  
  return (
    <>
      {subscribedspaceData.length ?
        <List>
          {
            subscribedspaceData.map((space: TSubscribedspaces, idx: number) => {
              return (
                <SubscribedspacesItem
                  key={`${space.SharedspaceId}+${idx}`}
                  space={space}
                  onDeleteSharedspace={onDeleteSharedspace} />
              );
            })
          }
        </List>
        :
        <EmptyResult>
          <h2>{emptyspaces}</h2>
        </EmptyResult>
      }
    </>
  );
};

export default SubscribedSpacesResult;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 70vh;
  padding: 0 20%;
  margin: 0;
  border-bottom: 1px solid var(--light-gray);
`;

const EmptyResult = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid var(--light-gray);

  h2 {
    color: var(--white);
    font-size: 28px;
    font-weight: 600;
    margin: 100px 0;
  }
`;