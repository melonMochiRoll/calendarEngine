import React, { FC, useDeferredValue, useState } from 'react';
import styled from '@emotion/styled';
import useUser from 'Hooks/queries/useUser';
import { useSubscribedspace } from 'Hooks/queries/useSubscribedspaces';
import SubscribedSpacesResult from 'Components/subscribedspaces/SubscribedspacesResult';
import SubscribedSpacesHeader from 'Components/subscribedspaces/SubscribedspacesHeader';
import SubscribedSpacesNull from 'Components/subscribedspaces/SubscribedSpacesNull';
import { SubscribedspacesSortOptions } from 'Typings/types';
import { useNavigate } from 'react-router-dom';
import { createSharedspace, deleteSharedspace } from 'Api/sharedspacesApi';
import { PATHS } from 'Constants/paths';
import { useQueryClient } from '@tanstack/react-query';
import { GET_SUBSCRIBED_SPACES_KEY } from 'Constants/queryKeys';
import { toast } from 'react-toastify';
import { defaultToastOption, waitingMessage } from 'Constants/notices';

const SubscribedSpacesContainer: FC = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [ option, setOption ] = useState(SubscribedspacesSortOptions[0]);
  const deferredInput = useDeferredValue(option);

  const { data: subscribedspaceData } = useSubscribedspace(deferredInput.filter);
  const { data: userData } = useUser({ suspense: true, throwOnError: true });

  const onCreateSharedspace = (UserId: number) => {
    createSharedspace(UserId)
      .then((url) => {
        navigate(`${PATHS.SHAREDSPACE_VIEW}/${url}`);
      })
      .catch(() => {
        toast.error(waitingMessage, {
          ...defaultToastOption,
        });
      });
  };

  const onDeleteSharedspace = (url: string) => {
    deleteSharedspace(url)
      .then(async () => {
        await qc.refetchQueries([GET_SUBSCRIBED_SPACES_KEY]);
      })
      .catch(() => {
        toast.error(waitingMessage, {
          ...defaultToastOption,
        });
      });
  };

  const filterSpaces = (option: typeof SubscribedspacesSortOptions[0]) => {
    setOption(option);
  };

  return (
    <Main>
      <SubscribedSpacesHeader
        onCreateSharedspace={() => onCreateSharedspace(userData.id)}
        optionText={deferredInput.text}
        filterSpaces={filterSpaces} />
      {subscribedspaceData?.length ?
        <SubscribedSpacesResult
          subscribedspaceData={subscribedspaceData}
          onDeleteSharedspace={onDeleteSharedspace} /> :
        <SubscribedSpacesNull />}
    </Main>
  );
};

export default SubscribedSpacesContainer;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
`;