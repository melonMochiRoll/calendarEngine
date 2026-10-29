import React, { FC, Suspense } from 'react';
import styled from '@emotion/styled';
import JoinRequestManagerMain from './JoinRequestManagerMain';
import ModalLoadingCircular from 'Src/components/async/skeleton/ModalLoadingCircular';
import JoinRequestManagerHeader from './JoinRequestManagerHeader';

interface JoinRequestManagerModalProps {};

const JoinRequestManagerModal: FC<JoinRequestManagerModalProps> = ({}) => {
  return (
    <Block onClick={e => e.stopPropagation()}>
      <JoinRequestManagerHeader />
      <Suspense fallback={<ModalLoadingCircular />}>
        <JoinRequestManagerMain />
      </Suspense>
    </Block>
  );
};

export default JoinRequestManagerModal;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  width: 650px;
  height: 500px;
  border-radius: 15px;
  background-color: var(--black);
  box-shadow: 1px 1px 10px 2px #000;
`;