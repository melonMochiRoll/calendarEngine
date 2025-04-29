import React, { FC } from 'react';
import styled from '@emotion/styled';
import SearchHeader from './SearchHeader';
import AsyncBoundary from 'Components/AsyncBoundary';
import GenericErrorFallback from 'Components/errors/GenericErrorFallback';
import SharedspaceManagerError from '../sharedspaceManager/SharedspaceManagerError';
import LoadingCircular from 'Components/skeleton/LoadingCircular';
import SearchMain from './SearchMain';
import { useQueryClient } from '@tanstack/react-query';
import { SEARCH_TODOS_KEY } from 'Lib/queryKeys';

const SearchModal: FC = () => {
  const qc = useQueryClient();

  return (
    <Block
      onClick={e => e.stopPropagation()}>
      <SearchHeader />
      <AsyncBoundary
        errorBoundaryFallback={GenericErrorFallback}
        suspenseFallback={<LoadingCircular />}
        errorRenderComponent={<SharedspaceManagerError message={'에러가 발생했습니다.'} />}
        onReset={() => {
          qc.removeQueries([SEARCH_TODOS_KEY]);
        }}>
        <SearchMain />
      </AsyncBoundary>
      <Footer />
    </Block>
  );
};

export default SearchModal;

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

const Footer = styled.footer`
  width: 100%;
  height: 5%;
  background-color: var(--black);
  border-top: 1px solid var(--light-gray);
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
`;