import React, { FC, Suspense } from 'react';
import SearchMain from './SearchMain';
import { ErrorBoundary } from 'react-error-boundary';
import ModalLoadingCircular from 'Src/components/async/skeleton/ModalLoadingCircular';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { useQueryClient } from '@tanstack/react-query';
import { closeModal } from 'Src/features/modalSlice';
import { SEARCH_TODOS_KEY } from 'Src/constants/queryKeys';
import { useParams } from 'react-router-dom';
import ModalFallback from 'Src/components/async/fallbackUI/ModalFallback';
import { BaseModalProps } from 'Src/typings/types';

interface SearchModalProps extends BaseModalProps {};

const SearchModal: FC<SearchModalProps> = ({
  idx,
  title,
}) => {
  const { url } = useParams();
  const qc = useQueryClient();
  const dispatch = useAppDispatch();

  function handleClose() {
    dispatch(closeModal());
  }

  function removeQueries() {
    qc.removeQueries([SEARCH_TODOS_KEY, url]);
  }

  return (
    <ErrorBoundary fallbackRender={(props) => ModalFallback(props, idx, title, handleClose, url, removeQueries)}>
      <Suspense fallback={<ModalLoadingCircular idx={idx} handleClose={handleClose}/>}>
        <SearchMain idx={idx} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default SearchModal;