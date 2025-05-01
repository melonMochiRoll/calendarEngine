import React, { FC } from 'react';
import styled from '@emotion/styled';
import useUser from 'Hooks/useUser';
import useSubscribedspace from 'Hooks/useSubscribedspaces';
import SubscribedSpacesResult from 'Components/subscribedspaces/SubscribedspacesResult';
import SubscribedSpacesHeader from 'Components/subscribedspaces/SubscribedspacesHeader';
import SubscribedSpacesNull from 'Components/subscribedspaces/SubscribedSpacesNull';

const SubscribedSpacesContainer: FC = () => {
  const { data: userData } = useUser({ suspense: true, throwOnError: true });
  const { data: subscribedspaceData } = useSubscribedspace({ suspense: true, throwOnError: true });

  return (
    <Main>
      <SubscribedSpacesHeader userData={userData} />
      {subscribedspaceData.length ?
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