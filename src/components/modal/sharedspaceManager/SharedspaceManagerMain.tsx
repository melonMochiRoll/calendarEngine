import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { useSharedspace } from 'Hooks/queries/useSharedspace';
import SharedspaceManagerInitPage from './SharedspaceManagerInitPage';
import SharedspaceManagerResult from './SharedspaceManagerResult';
import { useSearchUsers } from 'Hooks/queries/useSearchUsers';
import { createSharedspaceMembers, deleteSharedspaceMembers, updateSharedspaceMembers, updateSharedspaceOwner, updateSharedspacePrivate } from 'Api/sharedspacesApi';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { GET_SHAREDSPACE_KEY } from 'Constants/queryKeys';
import { TSharedspaceMembersRoles } from 'Typings/types';
import { toast } from 'react-toastify';
import { defaultToastOption, successMessage, waitingMessage } from 'Constants/notices';
import { useSharedpacemembers } from 'Src/hooks/queries/useSharedpacemembers';
import SharedspaceManagerHeader from './SharedspaceManagerHeader';
import { useDebounce } from 'Src/hooks/utils/useDebounce';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { closeModal } from 'Src/features/modalSlice';

interface SharedspaceManagerMainProps {
  idx: number,
};

const SharedspaceManagerMain: FC<SharedspaceManagerMainProps> = ({
  idx,
}) => {
  const { url } = useParams();
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  const [ query, setQuery ] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const { data: spaceData } = useSharedspace();
  const { data: searchUsersData, nextPage: searchUsersNextPage } = useSearchUsers(debouncedQuery);
  const { data: membersData, nextPage: sharedspaceMembersNextPage } = useSharedpacemembers(); 
  const [ error, setError ] = useState('');

  const onCreateMember = (UserId: number, RoleName: TSharedspaceMembersRoles) => {
    createSharedspaceMembers(url, UserId, RoleName)
      .then(async () => {
        await qc.refetchQueries([GET_SHAREDSPACE_KEY, url]);
      })
      .catch(() => {
        setError(waitingMessage);
      });
  };

  const onUpdateSharedspacePrivate = (Private: boolean) => {
    updateSharedspacePrivate(url, Private)
      .then(async () => {
        await qc.refetchQueries([GET_SHAREDSPACE_KEY, url]);
      })
      .catch(() => {
        setError(waitingMessage);
      });
  };

  const onUpdateMemberRole = (UserId: number, roleName: TSharedspaceMembersRoles) => {
    updateSharedspaceMembers(url, UserId, roleName)
      .then(async () => {
        await qc.refetchQueries([GET_SHAREDSPACE_KEY, url]);
          toast.success(successMessage, {
          ...defaultToastOption,
        });
      })
      .catch(() => {
        setError(waitingMessage);
      });
  };

  const onUpdateOwner = (UserId: number) => {
    updateSharedspaceOwner(url, UserId)
      .then(async () => {
        await qc.refetchQueries([GET_SHAREDSPACE_KEY, url]);
        toast.success(successMessage, {
          ...defaultToastOption,
        });
      })
      .catch(() => {
        setError(waitingMessage);
      });
  };

  const onDeleteMember = (UserId: number) => {
    deleteSharedspaceMembers(url, UserId)
      .then(async () => {
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
    <Backdrop
      zIndex={100 + idx}
      isBottom={!idx}
      onClick={() => dispatch(closeModal())}>
      <Block onClick={e => e.stopPropagation()}>
        <SharedspaceManagerHeader
          query={query}
          setQuery={setQuery} />
        <Main>
          {error && <ErrorSpan>{error}</ErrorSpan>}
          {debouncedQuery ?
            <SharedspaceManagerResult
              query={query}
              searchUsersData={searchUsersData}
              nextPage={searchUsersNextPage}
              onCreateMember={onCreateMember} /> :
            <SharedspaceManagerInitPage
              membersData={membersData}
              spacePrivate={spaceData.private}
              nextPage={sharedspaceMembersNextPage}
              onUpdateSharedspacePrivate={onUpdateSharedspacePrivate}
              onUpdateMemberRole={onUpdateMemberRole}
              onUpdateOwner={onUpdateOwner}
              onDeleteMember={onDeleteMember} />
          }
        </Main>
      </Block>
    </Backdrop>
  );
};

export default SharedspaceManagerMain;

const Backdrop = styled.div<{ zIndex: number, isBottom: boolean }>`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ isBottom }) => isBottom ? 'rgba(0, 0, 0, 0.8)' : ''};
  z-index: ${({ zIndex }) => zIndex};
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  width: 650px;
  height: 500px;
  border: 1px solid #1d2126;
  border-radius: 15px;
  background-color: var(--black);
  box-shadow: 1px 1px 10px 2px #000;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 85%;
  color: var(--white);
  padding: 1% 0;
`;

const ErrorSpan = styled.span`
  font-size: 16px;
  color: var(--red);
`;