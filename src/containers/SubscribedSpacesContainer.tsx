import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useSubscribedspace } from 'Hooks/queries/useSubscribedspaces';
import SubscribedSpacesResult from 'Components/subscribedspaces/SubscribedspacesResult';
import SubscribedSpacesHeader from 'Components/subscribedspaces/SubscribedspacesHeader';
import SubscribedSpacesNull from 'Components/subscribedspaces/SubscribedSpacesNull';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createSharedspace, deleteSharedspace } from 'Api/sharedspacesApi';
import { PATHS } from 'Constants/paths';
import { useQueryClient } from '@tanstack/react-query';
import { GET_SUBSCRIBED_SPACES_KEY } from 'Constants/queryKeys';
import { toast } from 'react-toastify';
import { defaultToastOption, waitingMessage } from 'Constants/notices';
import SubscribedSpacesPagination from 'Src/components/subscribedspaces/SubscribedSpacesPagination';

const SubscribedSpacesContainer: FC = () => {
  const navigate = useNavigate();
  const [ searchParams, setSearchParams ] = useSearchParams();
  const qc = useQueryClient();
  const sort = searchParams.get('sort') || 'all';
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data: subscribedspaceData } = useSubscribedspace(sort, currentPage);

  const onCreateSharedspace = () => {
    createSharedspace()
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
        await qc.refetchQueries([GET_SUBSCRIBED_SPACES_KEY, sort, currentPage]);
      })
      .catch(() => {
        toast.error(waitingMessage, {
          ...defaultToastOption,
        });
      });
  };

  const sortSpaces = (sort: string) => {
    setSearchParams({ sort });
  };

  const goToPage = (page: number) => {
    setSearchParams({ sort, page: String(page) });
  };

  return (
    <Main>
      <SubscribedSpacesHeader
        onCreateSharedspace={() => onCreateSharedspace()}
        sort={sort}
        sortSpaces={sortSpaces} />
      {subscribedspaceData.spaces.length ?
        <SubscribedSpacesResult
          spaces={subscribedspaceData.spaces}
          onDeleteSharedspace={onDeleteSharedspace} /> :
        <SubscribedSpacesNull />}
      <SubscribedSpacesPagination
        currentPage={currentPage}
        totalCount={subscribedspaceData.totalCount}
        goToPage={goToPage} />
    </Main>
  );
};

export default SubscribedSpacesContainer;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
`;