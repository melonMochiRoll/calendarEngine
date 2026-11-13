import React, { FC, useState } from 'react';
import { closeModal } from 'Features/modalSlice';
import { useAppDispatch } from 'Hooks/reduxHooks';
import { createJoinRequest } from 'Api/joinrequestApi';
import { alreadyRequest, checkURL, defaultToastOption, successMessage, waitingMessage } from 'Constants/notices';
import { toast } from 'react-toastify';
import JoinRequestSenderMain from './JoinRequestSenderMain';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';

interface JoinRequestSenderModalProps {};

const JoinRequestSenderModal: FC<JoinRequestSenderModalProps> = ({}) => {
  const { SharedspaceId } = useParams();
  const dispatch = useAppDispatch();
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState('');
  
  const onSubmit = async (message: string) => {
    setIsLoading(true);
    setError('');

    if (!SharedspaceId) {
      setError(checkURL);
      return;
    }

    try {
      await createJoinRequest(SharedspaceId, message);

      toast.success(successMessage, defaultToastOption);
      dispatch(closeModal());
    } catch (err) {
      setError(err instanceof AxiosError ? err?.response?.data.message : waitingMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <JoinRequestSenderMain
      onSubmit={onSubmit}
      isLoading={isLoading}
      error={error} />
  );
};

export default JoinRequestSenderModal;