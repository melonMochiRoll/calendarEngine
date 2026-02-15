import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import useMenu from 'Hooks/utils/useMenu';
import { CircularProgress, Divider, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { RoleDictionary, SharedspaceMembersRoles, TSharedspaceMembersItem, TSharedspaceMembersRoles } from 'Typings/types';
import ProfileImage from 'Components/ProfileImage';
import { renderRole } from 'Lib/utilFunction';

interface MemberItemProps {
  item: TSharedspaceMembersItem,
  isOwner: boolean,
  onUpdateMemberRole: (UserId: number, roleName: TSharedspaceMembersRoles) => Promise<void>,
  onUpdateOwner: (UserId: number) => Promise<void>,
  onDeleteMember: (UserId: number) => Promise<void>,
};

const MemberItem: FC<MemberItemProps> = ({
  item,
  isOwner,
  onUpdateMemberRole,
  onUpdateOwner,
  onDeleteMember,
}) => {
  const [ isResponded, setIsResponded ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);
  const { UserId, email, profileImage, RoleName } = item;
  const label = isResponded || renderRole(RoleName);

  const {
    anchorEl,
    open,
    onOpen,
    onClose,
  } = useMenu();

  const handleUpdateMemberRole = async (e: React.MouseEvent<HTMLLIElement, MouseEvent>, role: TSharedspaceMembersRoles) => {
    e.stopPropagation();
    setIsLoading(true);
    onClose();

    try {
      await onUpdateMemberRole(UserId, role);
      setIsResponded('요청 완료');
    } catch (err) {
      setIsResponded('요청 실패');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOwner = async (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.stopPropagation();
    setIsLoading(true);
    onClose();
    
    try {
      await onUpdateOwner(UserId);
      setIsResponded('요청 완료');
    } catch (err) {
      setIsResponded('요청 실패');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMember = async (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.stopPropagation();
    setIsLoading(true);
    onClose();

    try {
      await onDeleteMember(UserId);
      setIsResponded('요청 완료');
    } catch (err) {
      setIsResponded('요청 실패');
    } finally {
      setIsLoading(false);
    }
  };
  
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
        isLoading ?
          <CircularProgress size={30} />
          :
          isOwner && !isResponded ?
            <Button onClick={(e) => {
              e.stopPropagation();
              onOpen(e);
            }}>
              <CurrentOption>{label}</CurrentOption>
              <ArrowDropDownIcon fontSize='large' />
            </Button>
            :
            <DisableButton>
              <CurrentOption>{label}</CurrentOption>
            </DisableButton>
      }
      <Menu
        aria-labelledby='demo-positioned-button'
        anchorEl={anchorEl}
        open={open}
        onClick={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <MenuItem onClick={(e) => handleUpdateMemberRole(e, SharedspaceMembersRoles.MEMBER)}>
            <span>{RoleDictionary.MEMBER}</span>
          </MenuItem>
          <MenuItem onClick={(e) => handleUpdateMemberRole(e, SharedspaceMembersRoles.VIEWER)}>
            <span>{RoleDictionary.VIEWER}</span>
          </MenuItem>
        <Divider />
        <MenuItem onClick={handleUpdateOwner}>
          <span>{`${RoleDictionary.OWNER} 변경`}</span>
        </MenuItem>
        <MenuItem onClick={handleDeleteMember}>
          <span>권한 삭제</span>
        </MenuItem>
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