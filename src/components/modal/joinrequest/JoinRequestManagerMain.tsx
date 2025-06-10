import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { useJoinRequest } from 'Hooks/queries/useJoinRequest';
import { TJoinRequest } from 'Typings/types';
import JoinRequestItem from './JoinRequestItem';
import { GET_JOINREQUEST_KEY, GET_SHAREDSPACE_KEY } from 'Constants/queryKeys';
import { rejectJoinRequest, resolveJoinRequest } from 'Api/joinrequestApi';
import { toast } from 'react-toastify';
import { defaultToastOption, successMessage, waitingMessage } from 'Constants/notices';
import { useQueryClient } from '@tanstack/react-query';

const JoinRequestManagerMain: FC = () => {
  const qc = useQueryClient();
  const { data: joinRequestsData } = useJoinRequest();
  const [ error, setError ] = useState('')

  const onResolveMenuClick = (
    url: string | undefined,
    id: number,
    roleName: string,
  ) => {
    resolveJoinRequest(url, id, roleName)
      .then(async () => {
        await qc.refetchQueries([GET_JOINREQUEST_KEY, url]);
        await qc.refetchQueries([GET_SHAREDSPACE_KEY, url]);
        toast.success(successMessage, {
          ...defaultToastOption,
        });
      })
      .catch(() => {
        setError(waitingMessage);
      });
  };

  const onRejectMenuClick = (
    url: string | undefined,
    id: number,
  ) => {
    rejectJoinRequest(url, id)
      .then(async () => {
        await qc.refetchQueries([GET_JOINREQUEST_KEY, url]);
        await qc.refetchQueries([GET_SHAREDSPACE_KEY, url]);
        toast.success(successMessage, {
          ...defaultToastOption,
        });
      })
      .catch(() => {
        setError(waitingMessage);
      });
  };

  return (
    <Block>
      <List>
        {joinRequestsData.map((request: TJoinRequest) => {
          return (
            <JoinRequestItem
              key={request.id}
              request={request}
              onResolveMenuClick={onResolveMenuClick}
              onRejectMenuClick={onRejectMenuClick} />
          );
        })}
      </List>
      {error && <ErrorSpan>{error}</ErrorSpan>}
    </Block>
  );
};

export default JoinRequestManagerMain;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 85%;
  padding-bottom: 15px;
  color: var(--white);
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0;
  padding-bottom: 1%;
  margin: 0;
  overflow-y: auto;
`;

const ErrorSpan = styled.span`
  font-size: 18px;
  color: var(--red);
`;