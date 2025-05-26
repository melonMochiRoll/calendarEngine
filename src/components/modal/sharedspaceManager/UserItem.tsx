import React, { FC } from 'react';
import styled from '@emotion/styled';
import useMenu from 'Hooks/utils/useMenu';
import { Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { RoleDictionary, SharedspaceMembersRoles, TSearchUsers, TSharedspaceMetaData } from 'Typings/types';
import { GET_SHAREDSPACE_KEY } from 'Constants/queryKeys';
import { useQueryClient } from '@tanstack/react-query';
import { createSharedspaceMembers } from 'Api/sharedspacesApi';
import { useParams } from 'react-router-dom';
import ProfileImage from 'Components/ProfileImage';

const createRoleOption = [
  {
    text: RoleDictionary.MEMBER,
    roleName: SharedspaceMembersRoles.MEMBER,
  },
  {
    text: RoleDictionary.VIEWER,
    roleName: SharedspaceMembersRoles.VIEWER,
  },
];

interface UserItemProps {
  spaceData: TSharedspaceMetaData,
  searchUserData: TSearchUsers,
};

const UserItem: FC<UserItemProps> = ({
  spaceData,
  searchUserData,
}) => {
  const qc = useQueryClient();
  const { url } = useParams();

  const {
    anchorEl,
    open,
    onOpen,
    onClose,
  } = useMenu();

  const onOpenWithEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onOpen(e);
  };

  const onCreateRoleMenuClick = async (e: React.MouseEvent<HTMLLIElement>, option: typeof createRoleOption[0]) => {
    e.stopPropagation();

    await createSharedspaceMembers(url, searchUserData.id, option.roleName);
    await qc.refetchQueries([GET_SHAREDSPACE_KEY]);
    onClose();
  };
  
  return (
    <Item>
      <ProfileWrapper>
        <ProfileImage
          profileImage={searchUserData.profileImage}
          email={searchUserData.email} />
      </ProfileWrapper>
      <EmailWrapper>
        <EmailText>{searchUserData.email}</EmailText>
      </EmailWrapper>
      {searchUserData.Sharedspacemembers.find((ele) => ele.SharedspaceId === spaceData.id) ?
        <DisableButton>
          <CurrentOption>이미 속한 유저</CurrentOption>
        </DisableButton>
        :
        <Button onClick={onOpenWithEvent}>
          <CurrentOption>초대</CurrentOption>
          <ArrowDropDownIcon fontSize='large' />
        </Button>}
      <Menu
        aria-labelledby='demo-positioned-button'
        anchorEl={anchorEl}
        open={open}
        onClick={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
        {createRoleOption.map((option: typeof createRoleOption[0], idx: number) => {
          return (
            <MenuItem
              key={option.text}
              onClick={(e) => onCreateRoleMenuClick(e, createRoleOption[idx])}>
              <span>{option.text}</span>
            </MenuItem>
          );
        })}
      </Menu>
    </Item>
  );
};

export default UserItem;

const Item = styled.li`
  display: flex;
  align-items: center;
  width: 100%;
  color: var(--white);
  list-style: none;
  gap: 15px;
  padding: 10px 15px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10%;
`;

const EmailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 70%;
`;

const EmailText = styled.span`
  font-size: 20px;
`;

const DisableButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  color: #828282;
`;

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const CurrentOption = styled.span`
  font-size: 20px;
`;