import React, { FC, Suspense } from 'react';
import SharedspaceManagerMain from './SharedspaceManagerMain';
import { ErrorBoundary } from 'react-error-boundary';
import { BaseModalProps } from 'Src/typings/types';
import ModalLoadingCircular from 'Src/components/async/skeleton/ModalLoadingCircular';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { closeModal } from 'Src/features/modalSlice';
import ModalFallback from 'Src/components/async/fallbackUI/ModalFallback';
import { SEARCH_USERS_KEY } from 'Src/constants/queryKeys';

interface SharedspaceManagerModalProps extends BaseModalProps {};

const SharedspaceManagerModal: FC<SharedspaceManagerModalProps> = ({
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
    qc.removeQueries([SEARCH_USERS_KEY, url]);
  }

  return (
    <ErrorBoundary fallbackRender={(props) => ModalFallback(props, idx, title, handleClose, url, removeQueries)}>
      <Suspense fallback={<ModalLoadingCircular idx={idx} handleClose={handleClose}/>}>
        <SharedspaceManagerMain idx={idx} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default SharedspaceManagerModal;