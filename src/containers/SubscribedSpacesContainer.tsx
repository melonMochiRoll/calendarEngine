import React, { FC, useDeferredValue, useState } from 'react';
import styled from '@emotion/styled';
import useUser from 'Hooks/useUser';
import useSubscribedspace from 'Hooks/queries/useSubscribedspaces';
import SubscribedSpacesResult from 'Components/subscribedspaces/SubscribedspacesResult';
import SubscribedSpacesHeader from 'Components/subscribedspaces/SubscribedspacesHeader';
import SubscribedSpacesNull from 'Components/subscribedspaces/SubscribedSpacesNull';
import { SubscribedspacesSortOptions } from 'Typings/types';

const SubscribedSpacesContainer: FC = () => {
  const [ option, setOption ] = useState(SubscribedspacesSortOptions[0]);
  const deferredInput = useDeferredValue(option);

  const { data: subscribedspaceData } = useSubscribedspace(deferredInput.filter);
  const { data: userData } = useUser({ suspense: true, throwOnError: true });

  return (
    <Main>
      <SubscribedSpacesHeader
        userData={userData}
        optionText={deferredInput.text}
        setOption={setOption} />
      {subscribedspaceData?.length ?
        <SubscribedSpacesResult subscribedspaceData={subscribedspaceData} /> :
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