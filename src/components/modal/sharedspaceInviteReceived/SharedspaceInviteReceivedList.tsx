import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { TInvite } from 'Src/typings/types';
import CheckIcon from '@mui/icons-material/CheckRounded';
import ClearIcon from '@mui/icons-material/ClearRounded';
import { CircularProgress } from '@mui/material';

interface SharedspaceInviteReceivedListProp {
  invites: TInvite[],
  hasMoreData: boolean,
  nextPage: () => void,
  acceptInvite: (id: number, url: string) => Promise<void>,
  declineInvite: (id: number, url: string) => Promise<void>,
};

const SharedspaceInviteReceivedList: FC<SharedspaceInviteReceivedListProp> = ({
  invites,
  hasMoreData,
  nextPage,
  acceptInvite,
  declineInvite,
}) => {
  const [ isResponded, setIsResponded ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);

  const handleAcceptInvite = async (id: number, url: string) => {
    setIsLoading(true);

    try {
      await acceptInvite(id, url);
      setIsResponded('수락 완료');
    } catch (err) {
      setIsResponded('요청 실패');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeclineInvite = async (id: number, url: string) => {
    setIsLoading(true);

    try {
      await declineInvite(id, url);
      setIsResponded('거절 완료');
    } catch (err) {
      setIsResponded('요청 실패');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <List>
      {
        invites.map((invite) => {
          return (
            <Item key={invite.id}>
              <Left>
                <Title>{invite.SharedspaceName}</Title>
                <OnwerInfo>
                  소유자 :&nbsp;
                  <Owner>{invite.OwnerEmail}</Owner>
                </OnwerInfo>
              </Left>
              <Right>
                {
                  isLoading ?
                    <CircularProgress size={30}/>
                    :
                    isResponded ?
                    <DisableButton>{isResponded}</DisableButton>
                    :
                    <>
                      <IconWrapper onClick={() => handleAcceptInvite(invite.id, invite.url)}>
                        <CheckIcon sx={{ color: 'var(--naver-green)' }} />
                      </IconWrapper>
                      <IconWrapper onClick={() => handleDeclineInvite(invite.id, invite.url)}>
                        <ClearIcon sx={{ color: 'var(--red)' }} />
                      </IconWrapper>
                    </>
                }
              </Right>
            </Item>
          );
        })
      }
      {
        hasMoreData &&
          <LoadMore onClick={() => nextPage()}>
            Load more
          </LoadMore>
      }
    </List>
  );
};

export default SharedspaceInviteReceivedList;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 70px;
  color: var(--white);
  list-style: none;
  padding: 15px 25px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Right = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  gap: 20px;
`;

const Title = styled.span`
  font-size: 24px;
  font-weight: 600;
`;

const OnwerInfo = styled.div`
  display: flex;
  font-size: 18px;
`;

const Owner = styled.span`
  color: var(--google-blue);
  font-weight: 500;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0);

  svg {
    font-size: 36px;
  }

  &:hover {
    svg {
      color: var(--white);
    }
  }
`;

const LoadMore = styled.button`
  font-size: 24px;
  font-weight: 600;
  padding: 10px 15px;
  margin: 20px 0;
  color: var(--white);
  border: 1px solid var(--light-gray);
  border-radius: 5px;
  background-color: var(--black);
  cursor: pointer;
  transition: all 0.1s linear;

  &:hover {
    background-color: var(--red);
    border-color: var(--red);
  }
`;

const DisableButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #828282;
`;