import React, { FC } from 'react';
import styled from '@emotion/styled';
import JoinContainer from 'Containers/JoinContainer';
import WithGuestGuard from 'Components/hoc/WithGuestGuard';

const JoinPage: FC = () => {
  return (
    <Block>
      <JoinContainer />
    </Block>
  );
};

export default WithGuestGuard(JoinPage);

const Block = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  background-color: #1f2128;
`;