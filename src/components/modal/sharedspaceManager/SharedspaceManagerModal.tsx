import React, { FC } from 'react';
import styled from '@emotion/styled';
import SharedspaceManagerMain from './SharedspaceManagerMain';
import AsyncBoundary from 'Components/AsyncBoundary';
import SharedspaceMangerHeader from './SharedspaceManagerHeader';
import GenericErrorFallback from 'Components/errors/GenericErrorFallback';
import { useAppDispatch } from 'Hooks/reduxHooks';
import { clearQuery } from 'Features/searchUsersSlice';
import SharedspaceManagerError from './SharedspaceManagerError';
import LoadingCircular from 'Components/skeleton/LoadingCircular';

const SharedspaceManagerModal: FC = () => {
  const dispatch = useAppDispatch();
  
  return (
    <Block
      onClick={e => e.stopPropagation()}>
      <SharedspaceMangerHeader />
      <AsyncBoundary
        errorBoundaryFallback={GenericErrorFallback}
        suspenseFallback={<LoadingCircular />}
        errorRenderComponent={<SharedspaceManagerError message={'에러가 발생했습니다.'} />}
        onError={() => {
          dispatch(clearQuery());
        }}>
        <SharedspaceManagerMain />
      </AsyncBoundary>
    </Block>
  );
};

export default SharedspaceManagerModal;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  width: 650px;
  height: 500px;
  border: 1px solid #1d2126;
  border-radius: 15px;
  background-color: var(--black);
  box-shadow: 1px 1px 10px 2px #000;
`;