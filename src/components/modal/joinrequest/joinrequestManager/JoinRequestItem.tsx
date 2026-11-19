import React, { FC, useRef, useState } from 'react';
import styled from '@emotion/styled';
import useMenu from 'Hooks/utils/useMenu';
import { CircularProgress, Divider, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { ModalName, RoleDictionary, SharedspaceMembersRoles, TJoinRequest } from 'Typings/types';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from 'Hooks/reduxHooks';
import ProfileAvatar from 'Src/components/ProfileAvatar';
import { openModal } from 'Features/modalSlice';
import { muiMenuDarkModeSx } from 'Src/constants/notices';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const resolveMenuOption = [
  {
    text: RoleDictionary.MEMBER,
    roleName: SharedspaceMembersRoles.MEMBER,
  },
  {
    text: RoleDictionary.VIEWER,
    roleName: SharedspaceMembersRoles.VIEWER,
  },
];

interface JoinRequestItemProps {
  request: TJoinRequest;
  onResolveMenuClick: (SharedspaceId: string | undefined, id: string, roleName: string) => Promise<void>;
  onRejectMenuClick: (SharedspaceId: string | undefined, id: string) => Promise<void>;
};

const JoinRequestItem: FC<JoinRequestItemProps> = ({
  request,
  onResolveMenuClick,
  onRejectMenuClick,
}) => {
  const dispatch = useAppDispatch();
  const { SharedspaceId } = useParams();
  const [ isLoading, setIsLoading ] = useState(false);
  const isSubmitting = useRef(false);
  const { id, message, Requestor } = request;

  const {
    anchorEl,
    open,
    onOpen,
    onClose,
  } = useMenu();

  const openJoinRequestDetail = (request: TJoinRequest) => {
    dispatch(openModal({
      name: ModalName.JOINREQUEST_DETAIL,
      props: { request },
    }));
  };

  const withLoading = async (task: () => Promise<void>) => {
    if (isSubmitting.current) return;

    setIsLoading(true);
    isSubmitting.current = true;

    try {
      await task();
    } finally {
      isSubmitting.current = false;
      setIsLoading(false);
    }
  };
  
  return (
    <Item onClick={() => openJoinRequestDetail(request)}>
      <Left>
        <ProfileAvatar
          ProfileImage={Requestor.ProfileImage}
          email={Requestor.email} />
      </Left>
      <Center>
        <Nickname>{Requestor.nickname}</Nickname>
        <Email>{Requestor.email}</Email>
      </Center>
      <Right onClick={onOpen} disabled={isLoading}>
        {isLoading ? <CircularProgress size={30} /> : <MoreHorizIcon fontSize='large' />}
      </Right>
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
          {
            resolveMenuOption.map((option: typeof resolveMenuOption[0]) => {
              return (
                <MenuItem
                  key={option.text}
                  onClick={(e) => {
                    withLoading(() => onResolveMenuClick(SharedspaceId, id, option.roleName));
                    onClose(e);
                  }}>
                  <span>{option.text}</span>
                </MenuItem>
              );
            })
          }
          <Divider />
            <MenuItem
              onClick={(e) => {
                withLoading(() => onRejectMenuClick(SharedspaceId, id))
                onClose(e);
              }}>
              <span>거절</span>
            </MenuItem>
        </Menu>
      }
    </Item>
  );
};

export default JoinRequestItem;

const Item = styled.li`
  display: flex;
  align-items: center;
  width: 100%;
  color: var(--white);
  list-style: none;
  gap: 15px;
  padding: 10px 15px;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10%;
`;

const Center = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 70%;
`;

const Nickname = styled.span`
  font-size: 20px;
`;

const Email = styled.span`
  font-size: 18px;
  color: var(--gray-6);
`;

const Message = styled.span`
  font-size: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Right = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  border: none;
  background-color: transparent;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const CurrentOption = styled.span`
  font-size: 22px;
`;