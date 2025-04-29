import React, { FC } from 'react';
import styled from '@emotion/styled';
import SharedspaceManagerMain from './SharedspaceManagerMain';
import AsyncBoundary from 'Components/AsyncBoundary';
import SkeletonSharedspaceManagerModal from 'Components/skeleton/modal/sharedspaceManager/SkeletonSharedspaceManagerModal';
import SharedspaceMangerHeader from './SharedspaceManagerHeader';
import GenericErrorFallback from 'Components/errors/GenericErrorFallback';
import { useAppDispatch } from 'Hooks/reduxHooks';
import { clearQuery } from 'Features/searchUsersSlice';
import { useQueryClient } from '@tanstack/react-query';
import { GET_SHAREDSPACE_KEY, SEARCH_USERS_KEY } from 'Lib/queryKeys';
import SharedspaceManagerError from './SharedspaceManagerError';

const SharedspaceManagerModal: FC = () => {
  const dispatch = useAppDispatch();
  const qc = useQueryClient();
  
  return (
    <Block
      onClick={e => e.stopPropagation()}>
      <SharedspaceMangerHeader />
      <AsyncBoundary
        errorBoundaryFallback={GenericErrorFallback}
        suspenseFallback={<SkeletonSharedspaceManagerModal />}
        errorRenderComponent={<SharedspaceManagerError message={'에러가 발생했습니다.'} />}
        onReset={() => {
          dispatch(clearQuery());
          qc.removeQueries([GET_SHAREDSPACE_KEY]);
          qc.removeQueries([SEARCH_USERS_KEY]);
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