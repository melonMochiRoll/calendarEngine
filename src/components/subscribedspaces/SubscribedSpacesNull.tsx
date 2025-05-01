import React, { FC } from 'react';
import styled from '@emotion/styled';
import { emptyspaces } from 'Lib/noticeConstants';

const SubscribedSpacesNull: FC = () => {
  return (
    <EmptyResult>
      <h2>{emptyspaces}</h2>
    </EmptyResult>
  );
};

export default SubscribedSpacesNull;

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