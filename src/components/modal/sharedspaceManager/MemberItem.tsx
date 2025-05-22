import React, { FC } from 'react';
import styled from '@emotion/styled';
import useMenu from 'Hooks/useMenu';
import { Divider, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { MemberOptions, RoleDictionary, SharedspaceMembersRoles, TSharedspaceMembersAndUser, TUser } from 'Typings/types';
import { deleteSharedspaceMembers, updateSharedspaceMembers, updateSharedspaceOwner } from 'Api/sharedspacesApi';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { GET_SHAREDSPACE_KEY } from 'Constants/queryKeys';
import { toast } from 'react-toastify';
import { defaultToastOption, successMessage } from 'Constants/notices';
import ProfileImage from 'Components/ProfileImage';

const updateRoleOption = [
  {
    text: RoleDictionary.MEMBER,
    roleName: SharedspaceMembersRoles.MEMBER,
    method: MemberOptions.UPDATE_MEMBER,
  },
  {
    text: RoleDictionary.VIEWER,
    roleName: SharedspaceMembersRoles.VIEWER,
    method: MemberOptions.UPDATE_MEMBER,
  },
];

const accessOption = [
  {
    text: `${RoleDictionary.OWNER} 변경`,
    method: MemberOptions.UPDATE_OWNER,
  },
  {
    text: '권한 삭제',
    method: MemberOptions.DELETE_MEMBER,
  },
];

interface MemberItemProps {
  OwnerData: Pick<TUser, 'id' | 'email'>;
  SharedspaceMembersAndUser: TSharedspaceMembersAndUser;
};

const MemberItem: FC<MemberItemProps> = ({
  OwnerData,
  SharedspaceMembersAndUser,
}) => {
  const qc = useQueryClient();
  const { url } = useParams();
  const { Role, UserId, User } = SharedspaceMembersAndUser;

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

  const renderRole = (roleName: string) => {
    const result = Object
      .entries(RoleDictionary)
      .find((ele) => ele[0] === roleName.toUpperCase());

    return result ? result[1] : '';
  };

  const onRolesUpdateMenuClick = async (e: any, option: typeof updateRoleOption[0]) => {
    e.stopPropagation();

    if (Role.name === option.roleName) {
      onClose();
      return;
    }

    await updateSharedspaceMembers(url, UserId, option.roleName);
    await qc.refetchQueries([GET_SHAREDSPACE_KEY]);
    onClose();
    toast.success(successMessage, {
      ...defaultToastOption,
    });
  };

  const onAccessMenuClick = async (e: any, option: typeof accessOption[0]) => {
    e.stopPropagation();

    if (option.method === MemberOptions.UPDATE_OWNER) {
      await updateSharedspaceOwner(url, OwnerData.id, UserId);
    }

    if (option.method === MemberOptions.DELETE_MEMBER) {
      await deleteSharedspaceMembers(url, UserId);
    }

    await qc.refetchQueries([GET_SHAREDSPACE_KEY]);
    onClose();
    toast.success(successMessage, {
      ...defaultToastOption,
    });
  };
  
  return (
    <Item>
      <ProfileWrapper>
        <ProfileImage
          profileImage={User.profileImage}
          email={User.email} />
      </ProfileWrapper>
      <EmailWrapper>
        <EmailText>{User.email}</EmailText>
      </EmailWrapper>
      {
        Role.name === SharedspaceMembersRoles.OWNER ?
        <DisableButton>
          <CurrentOption>{renderRole(Role.name)}</CurrentOption>
        </DisableButton>
        :
        <Button onClick={onOpenWithEvent}>
          <CurrentOption>{renderRole(Role.name)}</CurrentOption>
          <ArrowDropDownIcon fontSize='large' />
        </Button>
      }
      <Menu
        aria-labelledby='demo-positioned-button'
        anchorEl={anchorEl}
        open={open}
        onClick={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
        {
          updateRoleOption.map((option: typeof updateRoleOption[0], idx: number) => {
            return (
              <MenuItem
                key={option.text}
                onClick={(e) => onRolesUpdateMenuClick(e, updateRoleOption[idx])}>
                <span>{option.text}</span>
              </MenuItem>
            );
          })
        }
        <Divider />
        {
          accessOption.map((option: typeof accessOption[0], idx: number) => {
            return (
              <MenuItem
                key={option.text}
                onClick={(e) => onAccessMenuClick(e, accessOption[idx])}>
                <span>{option.text}</span>
              </MenuItem>
            );
          })
        }
      </Menu>
    </Item>
  );
};

export default MemberItem;

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
  font-size: 22px;
`;