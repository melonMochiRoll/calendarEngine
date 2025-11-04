import React, { FC } from 'react';
import styled from '@emotion/styled';
import ShieldIcon from '@mui/icons-material/VerifiedUser';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import useMenu from 'Hooks/utils/useMenu';
import { Menu, MenuItem } from '@mui/material';
import { TSharedspaceMembersList, TSharedspaceMembersRoles } from 'Typings/types';
import PeopleIcon from '@mui/icons-material/PeopleAltRounded';
import MemberItem from './MemberItem';

interface SharedspaceManagerInitPageProps {
  membersData: TSharedspaceMembersList,
  spacePrivate: boolean,
  nextPage: () => void,
  onUpdateSharedspacePrivate: (Private: boolean) => void,
  onUpdateMemberRole: (UserId: number, roleName: TSharedspaceMembersRoles) => void,
  onUpdateOwner: (UserId: number) => void,
  onDeleteMember: (UserId: number) => void,
};

const SharedspaceManagerInitPage: FC<SharedspaceManagerInitPageProps> = ({
  membersData,
  spacePrivate,
  nextPage,
  onUpdateMemberRole,
  onUpdateSharedspacePrivate,
  onUpdateOwner,
  onDeleteMember,
}) => {
  const {
    anchorEl,
    open,
    onOpen,
    onClose,
  } = useMenu();

  const renderPrivateText = (status: boolean) => {
    return status ? '권한이 있는 유저' : '모든 유저';
  };

  return (
    <>
      <MemberDiv>
        <Top>
          <PeopleIcon fontSize='large' sx={{ marginRight: '15px' }}/>
          <Title>권한이 있는 유저</Title>
        </Top>
        <MemberList>
          {membersData.items.map((member) => {
            return (
              <MemberItem
                key={member.UserId}
                item={member}
                onUpdateMemberRole={onUpdateMemberRole}
                onUpdateOwner={onUpdateOwner}
                onDeleteMember={onDeleteMember} />
            );
          })}
        {membersData.hasMoreData &&
          <LoadMore onClick={nextPage}>
            Load More
          </LoadMore>
        }
        </MemberList>
      </MemberDiv>
      <PrivateDiv>
        <Top>
          <ShieldIcon fontSize='large' sx={{ marginRight: '15px' }}/>
          <Title>액세스 권한 설정</Title>
        </Top>
        <Bottom>
          <Span>이 스페이스를</Span>
          <PrivateSwitch
            onClick={onOpen}>
            {renderPrivateText(spacePrivate)}
            <ArrowDropDownIcon fontSize='large' />
          </PrivateSwitch>
          <Menu
            aria-labelledby='demo-positioned-button'
            anchorEl={anchorEl}
            open={open}
            onClick={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{ marginTop: '10px' }}>
            {
              <MenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateSharedspacePrivate(!spacePrivate);
                  onClose();
                }}
                sx={{ fontSize: '20px', fontWeight: '500' }}>
                <span>{renderPrivateText(!spacePrivate)}</span>
              </MenuItem>
            }
          </Menu>
          <Span>가 접근하도록 합니다.</Span>
        </Bottom>
      </PrivateDiv>
    </>
  );
};

export default SharedspaceManagerInitPage;

const MemberDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 60%;
  padding-top: 2%;
`;

const PrivateDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 40%;
`;

const MemberList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0;
  margin: 0;
  overflow-y: auto;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 0 5%;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 500;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 5%;
`;

const PrivateSwitch = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 220px;
  font-size: 24px;
  font-weight: 500;
  padding-bottom: 2px;
  border-bottom: 1px solid var(--white);
  cursor: pointer;
`;

const Span = styled.span`
  font-size: 22px;
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