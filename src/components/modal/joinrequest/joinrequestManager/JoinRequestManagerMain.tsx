import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { useJoinRequest } from 'Hooks/queries/useJoinRequest';
import JoinRequestItem from './JoinRequestItem';
import { GET_JOINREQUEST_KEY, GET_SHAREDSPACE_KEY } from 'Constants/queryKeys';
import { rejectJoinRequest, resolveJoinRequest } from 'Api/joinrequestApi';
import { toast } from 'react-toastify';
import { defaultToastOption, successMessage, waitingMessage } from 'Constants/notices';
import { useQueryClient } from '@tanstack/react-query';
import JoinRequestManagerHeader from './JoinRequestManagerHeader';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { closeModal } from 'Src/features/modalSlice';
import ThreeDotIcon from '@mui/icons-material/PendingOutlined';

interface JoinRequestManagerMainProps {
  idx: number,
  title: string,
};

const JoinRequestManagerMain: FC<JoinRequestManagerMainProps> = ({
  idx,
  title,
}) => {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  const [ error, setError ] = useState('');
  const { data: joinRequestsData } = useJoinRequest();

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
    <Backdrop
      zIndex={100 + idx}
      isBottom={!idx}
      onClick={() => dispatch(closeModal())}>
      <Block onClick={e => e.stopPropagation()}>
        <JoinRequestManagerHeader title={title} />
        <Main>
          {error && <ErrorSpan>{error}</ErrorSpan>}
          {
            joinRequestsData?.length ?
              <List>
                {joinRequestsData.map((request) => {
                  return (
                    <JoinRequestItem
                      key={request.id}
                      request={request}
                      onResolveMenuClick={onResolveMenuClick}
                      onRejectMenuClick={onRejectMenuClick} />
                  );
                })}
              </List> :
              <>
                <ThreeDotIcon sx={IconInlineStyle} />
                <NotFoundMessage>요청이 없습니다.</NotFoundMessage>
              </>
          }
        </Main>
      </Block>
    </Backdrop>
  );
};

export default JoinRequestManagerMain;

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
  border-radius: 15px;
  background-color: var(--black);
  box-shadow: 1px 1px 10px 2px #000;
`;

const Main = styled.div`
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

const IconInlineStyle = {
  color: 'var(--white)',
  fontSize: '64px',
  paddingBottom: '15px',
};

const NotFoundMessage = styled.span`
  color: var(--white);
  font-size: 20px;
  font-weight: 600;
`;