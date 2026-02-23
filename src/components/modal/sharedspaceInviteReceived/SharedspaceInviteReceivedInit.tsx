import React, { FC } from 'react';
import styled from '@emotion/styled';

const SharedspaceInviteReceivedInit: FC = () => {
  return (
    <Main>
      <Span>받은 초대가 없습니다.</Span>
    </Main>
  );
};

export default SharedspaceInviteReceivedInit;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80%;
`;

const Span = styled.span`
  color: var(--white);
  font-size: 24px;
  font-weight: 600;
`;