import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { closeModal } from 'Features/modalSlice';
import { useAppDispatch } from 'Hooks/reduxHooks';
import { createJoinRequest } from 'Api/joinrequestApi';
import { alreadyRequest, checkURL, defaultToastOption, successMessage, waitingMessage } from 'Constants/notices';
import { toast } from 'react-toastify';
import JoinRequestSenderHeader from './JoinRequestSenderHeader';
import JoinRequestSenderMain from './JoinRequestSenderMain';
import { useParams } from 'react-router-dom';

const JoinRequestSenderModal: FC = () => {
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
    <Block onClick={e => e.stopPropagation()}>
      <JoinRequestSenderHeader />
      <JoinRequestSenderMain
        onSubmit={onSubmit}
        error={error} />
    </Block>
  );
};

export default JoinRequestSenderModal;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  width: 550px;
  height: 350px;
  border-radius: 15px;
  background-color: var(--black);
  box-shadow: 1px 1px 10px 2px #000;
`;