import React, { FC } from 'react';
import styled from '@emotion/styled';
import useMenu from 'Hooks/utils/useMenu';
import { Divider, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { RoleDictionary, SharedspaceMembersRoles, TSharedspaceMembersItem, TSharedspaceMembersRoles } from 'Typings/types';
import ProfileImage from 'Components/ProfileImage';
import { renderRole } from 'Lib/utilFunction';

interface MemberItemProps {
  item: TSharedspaceMembersItem;
  onUpdateMemberRole: (UserId: number, roleName: TSharedspaceMembersRoles) => void;
  onUpdateOwner: (UserId: number) => void;
  onDeleteMember: (UserId: number) => void;
};

const MemberItem: FC<MemberItemProps> = ({
  item,
  onUpdateMemberRole,
  onUpdateOwner,
  onDeleteMember,
}) => {
  const { UserId, email, profileImage, RoleName } = item;

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

  const updateRoleOptions = [
    {
      text: RoleDictionary.MEMBER,
      roleName: SharedspaceMembersRoles.MEMBER,
    },
    {
      text: RoleDictionary.VIEWER,
      roleName: SharedspaceMembersRoles.VIEWER,
    },
  ];

  const accessOption = [
    {
      text: `${RoleDictionary.OWNER} 변경`,
      action: () => onUpdateOwner(UserId),
    },
    {
      text: '권한 삭제',
      action: () => onDeleteMember(UserId),
    }
  ];
  
  return (
    <Item>
      <ProfileWrapper>
        <ProfileImage
          profileImage={profileImage}
          email={email} />
      </ProfileWrapper>
      <EmailWrapper>
        <EmailText>{email}</EmailText>
      </EmailWrapper>
      {
        RoleName === SharedspaceMembersRoles.OWNER ?
        <DisableButton>
          <CurrentOption>{renderRole(RoleName)}</CurrentOption>
        </DisableButton>
        :
        <Button onClick={onOpenWithEvent}>
          <CurrentOption>{renderRole(RoleName)}</CurrentOption>
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
          updateRoleOptions.map((option: typeof updateRoleOptions[0]) => {
            if (RoleName !== option.roleName) {
              return (
                <MenuItem
                  key={option.text}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateMemberRole(UserId, option.roleName);
                    onClose();
                  }}>
                  <span>{option.text}</span>
                </MenuItem>
              );
            }
          })
        }
        <Divider />
        {
          accessOption.map((option: typeof accessOption[0]) => {
            return (
              <MenuItem
                key={option.text}
                onClick={(e) => {
                  e.stopPropagation();
                  option.action();
                  onClose();
                }}>
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