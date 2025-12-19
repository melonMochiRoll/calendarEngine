import React, { FC, Suspense } from 'react';
import JoinRequestManagerMain from './JoinRequestManagerMain';
import { ErrorBoundary } from 'react-error-boundary';
import ModalLoadingCircular from 'Src/components/async/skeleton/ModalLoadingCircular';
import ModalFallback from 'Src/components/async/fallbackUI/ModalFallback';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { closeModal } from 'Src/features/modalSlice';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { GET_JOINREQUEST_KEY } from 'Src/constants/queryKeys';

interface JoinRequestManagerModalProps {
  idx: number,
  title: string,
};

const JoinRequestManagerModal: FC<JoinRequestManagerModalProps> = ({
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
    qc.removeQueries([GET_JOINREQUEST_KEY, url]);
  }

  return (
    <ErrorBoundary fallbackRender={(props) => ModalFallback(props, idx, title, handleClose, url, removeQueries)}>
      <Suspense fallback={<ModalLoadingCircular idx={idx} handleClose={handleClose}/>}>
        <JoinRequestManagerMain
          idx={idx}
          title={title} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default JoinRequestManagerModal;