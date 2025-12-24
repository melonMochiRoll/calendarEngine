import React, { FC, Suspense } from 'react';
import SharedspaceMemberListMain from './SharedspaceMemberListMain';
import { ErrorBoundary } from 'react-error-boundary';
import { BaseModalProps } from 'Src/typings/types';
import ModalLoadingCircular from 'Src/components/async/skeleton/ModalLoadingCircular';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import ModalFallback from 'Src/components/async/fallbackUI/ModalFallback';
import { closeModal } from 'Src/features/modalSlice';
import { GET_SHAREDSPACE_MEMBERS_KEY } from 'Src/constants/queryKeys';

interface SharedspaceMemberListModalProps extends BaseModalProps {};

const SharedspaceMemberListModal: FC<SharedspaceMemberListModalProps> = ({
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
    qc.removeQueries([GET_SHAREDSPACE_MEMBERS_KEY, url]);
  }

  return (
    <ErrorBoundary fallbackRender={(props) => ModalFallback(props, idx, title, handleClose, url, removeQueries)}>
      <Suspense fallback={<ModalLoadingCircular idx={idx} handleClose={handleClose}/>}>
        <SharedspaceMemberListMain
          idx={idx}
          title={title} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default SharedspaceMemberListModal;