import React, { FC } from 'react';
import styled from '@emotion/styled';
import useMenu from 'Hooks/utils/useMenu';
import { Divider, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { ModalName, RoleDictionary, SharedspaceMembersRoles, TJoinRequest } from 'Typings/types';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from 'Hooks/reduxHooks';
import ProfileImage from 'Components/ProfileImage';
import { openModal } from 'Features/modalSlice';

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
  onResolveMenuClick: (url: string | undefined, id: number, roleName: string) => void;
  onRejectMenuClick: (url: string | undefined, id: number) => void;
};

const JoinRequestItem: FC<JoinRequestItemProps> = ({
  request,
  onResolveMenuClick,
  onRejectMenuClick,
}) => {
  const dispatch = useAppDispatch();
  const { url } = useParams();
  const { id, message, Requestor } = request;

  const {
    anchorEl,
    open,
    onOpen,
    onClose,
  } = useMenu();

  const onOpenWithEvent = (e: any) => {
    e.stopPropagation();
    onOpen(e);
  };

  const openJoinRequestDetail = (request: TJoinRequest) => {
    dispatch(openModal({
      name: ModalName.JOINREQUEST_DETAIL,
      props: { payload: { request } },
    }));
  };
  
  return (
    <Item onClick={() => openJoinRequestDetail(request)}>
      <Left>
        <ProfileImage
          profileImage={Requestor.profileImage}
          email={Requestor.email} />
      </Left>
      <Center>
        <Email>{Requestor.email}</Email>
        <Message>{message}</Message>
      </Center>
      <Right onClick={onOpenWithEvent}>
        <CurrentOption>메뉴</CurrentOption>
        <ArrowDropDownIcon fontSize='large' />
      </Right>
      <Menu
        aria-labelledby='demo-positioned-button'
        anchorEl={anchorEl}
        open={open}
        onClick={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
        {
          resolveMenuOption.map((option: typeof resolveMenuOption[0]) => {
            return (
              <MenuItem
                key={option.text}
                onClick={(e) => {
                  e.stopPropagation();
                  onResolveMenuClick(url, id, option.roleName);
                  onClose();
                }}>
                <span>{option.text}</span>
              </MenuItem>
            );
          })
        }
        <Divider />
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              onRejectMenuClick(url, id);
              onClose();
            }}>
            <span>거절</span>
          </MenuItem>
      </Menu>
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

const Email = styled.span`
  font-size: 20px;
`;

const Message = styled.span`
  font-size: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Right = styled.div`
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