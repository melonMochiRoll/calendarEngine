import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import useMenu from 'Hooks/utils/useMenu';
import { CircularProgress, Divider, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { RoleDictionary, SharedspaceMembersRoles, TSpaceMembers, TSharedspaceMembersRoles } from 'Typings/types';
import { deleteSharedspaceMembers, updateSharedspaceMembers, updateSharedspaceOwner } from 'Api/sharedspacesApi';
import ProfileAvatar from 'Src/components/ProfileAvatar';
import { renderRole } from 'Lib/utilFunction';
import { useQueryClient } from '@tanstack/react-query';
import { GET_SHAREDSPACE_MEMBERS_KEY } from 'Src/constants/queryKeys';
import { useParams } from 'react-router-dom';
import { muiMenuDarkModeSx } from 'Src/constants/notices';

interface MemberItemProps {
  item: TSpaceMembers,
  isOwner: boolean,
};

const MemberItem: FC<MemberItemProps> = ({
  item,
  isOwner,
}) => {
  const { url } = useParams();
  const qc = useQueryClient();
  const [ isSent, setIsSent ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);
  const { UserId, email, nickname, ProfileImage, RoleName } = item;
  const label = isSent || renderRole(RoleName);

  const {
    anchorEl,
    open,
    onOpen,
    onClose,
  } = useMenu();

  const handleUpdateMemberRole = async (e: React.MouseEvent<HTMLLIElement, MouseEvent>, role: TSharedspaceMembersRoles) => {
    if (!url) return;
    
    setIsLoading(true);
    onClose(e);

    try {
      await updateSharedspaceMembers(url, UserId, role);
      await qc.refetchQueries([GET_SHAREDSPACE_MEMBERS_KEY, url]);
      setIsSent('요청 완료');
    } catch (err) {
      setIsSent('요청 실패');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOwner = async (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    if (!url) return;

    setIsLoading(true);
    onClose(e);
    
    try {
      await updateSharedspaceOwner(url, UserId);
      await qc.refetchQueries([GET_SHAREDSPACE_MEMBERS_KEY, url]);
      setIsSent('요청 완료');
    } catch (err) {
      setIsSent('요청 실패');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMember = async (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    if (!url) return;

    setIsLoading(true);
    onClose(e);

    try {
      await deleteSharedspaceMembers(url, UserId);
      await qc.refetchQueries([GET_SHAREDSPACE_MEMBERS_KEY, url]);
      setIsSent('요청 완료');
    } catch (err) {
      setIsSent('요청 실패');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Item>
      <ProfileWrapper>
        <ProfileAvatar
          ProfileImage={ProfileImage}
          email={email} />
      </ProfileWrapper>
      <InfoWrapper>
        <InfoNickname>{nickname}</InfoNickname>
        <InfoEmail>{email}</InfoEmail>
      </InfoWrapper>
      {
        isLoading ?
          <CircularProgress size={30} />
          :
          isOwner && !isSent ?
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
      {
        anchorEl &&
        <Menu
          aria-labelledby='demo-positioned-button'
          anchorEl={anchorEl}
          open={open}
          onClick={onClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={muiMenuDarkModeSx}>
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
      }
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

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 70%;
`;

const InfoNickname = styled.span`
  font-size: 20px;
`;

const InfoEmail = styled.span`
  font-size: 18px;
  color: var(--gray-6);
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