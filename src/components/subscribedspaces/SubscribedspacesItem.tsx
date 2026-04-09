import React, { FC } from 'react';
import styled from '@emotion/styled';
import LockIcon from '@mui/icons-material/Lock';
import UnlockIcon from '@mui/icons-material/LockOpen';
import { useNavigate } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem } from '@mui/material';
import useMenu from 'Hooks/utils/useMenu';
import DeleteIcon from '@mui/icons-material/DeleteForeverOutlined';
import { TSubscribedspace } from 'Typings/types';
import { toast } from 'react-toastify';
import { defaultToastOption, successMessage } from 'Constants/notices';
import ProfileImage from '../ProfileImage';

interface TSubscribedspacesItemProps {
  space: TSubscribedspace,
  onDeleteSharedspace: (url: string) => Promise<void>,
};

const SubscribedspacesItem: FC<TSubscribedspacesItemProps> = ({
  space,
  onDeleteSharedspace,
}) => {
  const navigate = useNavigate();
  const { name, url, private: privateBool, Owner, permission } = space;

  const {
    anchorEl,
    open,
    onOpen,
    onClose,
  } = useMenu();

  const onClickMoreMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onOpen(e);
  };

  const onCloseMoreMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onClose();
  };

  const onClickDelete = async (e: React.MouseEvent<HTMLLIElement, MouseEvent>, url: string) => {
    e.stopPropagation();
    
    await onDeleteSharedspace(url);
    onClose();
    toast.success(successMessage, {
      ...defaultToastOption,
    });
  };
  
  return (
    <Item
      onClick={() => navigate(`/sharedspaces/view/${url}`)}>
      <ItemPrivate>{privateBool ? <LockIcon /> : <UnlockIcon />}</ItemPrivate>
      <ItemTitle>{name}</ItemTitle>
      <ItemOwner>
        <ProfileImage
          profileImage={Owner.profileImage}
          email={Owner.email} />
        {Owner.nickname}
      </ItemOwner>
      {
        permission.isOwner ?
        <ItemMoreMenu onClick={onClickMoreMenu}>
          <MoreVertIcon fontSize='large' />
        </ItemMoreMenu> :
        <ItemMoreMenu />
      }
      <Menu
        aria-labelledby='demo-positioned-button'
        anchorEl={anchorEl}
        open={open}
        onClick={onCloseMoreMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ marginTop: '10px' }}>
          <MenuItem
            onClick={(e) => onClickDelete(e, url)}
            sx={{ gap: '5px' }}>
            <DeleteIcon />
            <span>삭제</span>
          </MenuItem>
      </Menu>
    </Item>
  );
};

export default SubscribedspacesItem;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px 30px;
  color: var(--white);
  border-bottom: 1px solid var(--light-gray);
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    background-color: var(--light-gray);
  }
`;

const ItemPrivate = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10%;
  font-size: 20px;
  text-align: center;
  gap: 5px;
`;

const ItemTitle = styled.div`
  width: 45%;
  margin: 0;
  font-size: 28px;
`;

const ItemOwner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25%;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  gap: 10px;
`;

const ItemMoreMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5%;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;

  svg {
    border-radius: 25px;

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
`;