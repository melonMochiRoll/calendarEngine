import React, { FC } from 'react';
import styled from '@emotion/styled';
import { TSubscribedspaces } from 'Typings/types';
import SubscribedspacesItem from './SubscribedspacesItem';

interface SubscribedSpacesResultProps {
  subscribedspaceData: TSubscribedspaces[];
  onDeleteSharedspace: (url: string) => void;
};

const SubscribedSpacesResult: FC<SubscribedSpacesResultProps> = ({
  subscribedspaceData,
  onDeleteSharedspace,
}) => {
  return (
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