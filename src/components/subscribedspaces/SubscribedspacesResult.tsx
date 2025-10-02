import React, { FC } from 'react';
import styled from '@emotion/styled';
import { TSubscribedspace } from 'Typings/types';
import SubscribedspacesItem from './SubscribedspacesItem';

interface SubscribedSpacesResultProps {
  spaces: TSubscribedspace[];
  onDeleteSharedspace: (url: string) => void;
};

const SubscribedSpacesResult: FC<SubscribedSpacesResultProps> = ({
  spaces,
  onDeleteSharedspace,
}) => {
  return (
    <List>
      {
        spaces.map((space, idx) => {
          return (
            <SubscribedspacesItem
              key={`${space.id}+${idx}`}
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
  padding: 0 20% 2% 20%;
  margin: 0;
`;