import React, { FC, useState } from 'react';
import { closeModal } from 'Features/modalSlice';
import { useAppDispatch } from 'Hooks/reduxHooks';
import { createJoinRequest } from 'Api/joinrequestApi';
import { alreadyRequest, checkURL, defaultToastOption, successMessage, waitingMessage } from 'Constants/notices';
import { toast } from 'react-toastify';
import JoinRequestSenderMain from './JoinRequestSenderMain';
import { useParams } from 'react-router-dom';
import { BaseModalProps } from 'Src/typings/types';

interface JoinRequestSenderModalProps extends BaseModalProps {};

const JoinRequestSenderModal: FC<JoinRequestSenderModalProps> = ({
  idx,
  title,
}) => {
  const { url } = useParams();
  const dispatch = useAppDispatch();
  const [ error, setError ] = useState('');
  
  const onSubmit = (message: string) => {
    setError('');

    if (!url) {
      setError(checkURL);
      return;
    }

    createJoinRequest(url, message)
      .then(() => {
        toast.success(successMessage, {
          ...defaultToastOption,
        });
        dispatch(closeModal());
      })
      .catch((error) => {
        const errorMessage = error?.response?.status === 409 ?
          alreadyRequest :
          waitingMessage;
        
        setError(errorMessage);
      });
  };

  return (
    <JoinRequestSenderMain
      onSubmit={onSubmit}
      idx={idx}
      title={title}
      error={error} />
  );
};

export default JoinRequestSenderModal;