import React, { FC } from 'react';
import styled from '@emotion/styled';
import { TSubscribedspaces } from 'Typings/types';
import SubscribedspacesItem from './SubscribedspacesItem';
import useSubscribedspace from 'Hooks/useSubscribedspaces';
import { CircularProgress } from '@mui/material';
import { emptyspaces } from 'Lib/noticeConstants';
import { deleteSharedspace } from 'Api/sharedspacesApi';
import { useQueryClient } from '@tanstack/react-query';
import { GET_SUBSCRIBED_SPACES_KEY } from 'Lib/queryKeys';

interface SubscribedSpacesResultProps {
  option: { text: string, filter: string },
};

const SubscribedSpacesResult: FC<SubscribedSpacesResultProps> = ({
  option,
}) => {
  const qc = useQueryClient();
  const {
    data: subscribedspaceData,
    isLoading,
  } = useSubscribedspace(option.filter);

  const onDeleteSharedspace = async (SharedspaceId: number) => {
    await deleteSharedspace(SharedspaceId);
    await qc.refetchQueries([GET_SUBSCRIBED_SPACES_KEY]);
  };

  if (isLoading) {
    return <CircularProgress size={100} sx={{ marginTop: '100px' }}/>;
  }

  if (!subscribedspaceData || !subscribedspaceData.length) {
    return (
      <EmptyResult>
        <h2>{emptyspaces}</h2>
      </EmptyResult>
    );
  }
  
  return (
    <>
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
    </>
  );
};

export default SubscribedSpacesResult;

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