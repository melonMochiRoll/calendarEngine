import React, { FC } from 'react';
import styled from '@emotion/styled';
import LockIcon from '@mui/icons-material/Lock';
import UnlockIcon from '@mui/icons-material/LockOpen';
import { useNavigate } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem } from '@mui/material';
import useMenu from 'Hooks/useMenu';
import DeleteIcon from '@mui/icons-material/DeleteForeverOutlined';
import { TSubscribedspaces } from 'Typings/types';
import useUser from 'Hooks/useUser';
import { toast } from 'react-toastify';
import { defaultToastOption, successMessage } from 'Constants/notices';

interface TSubscribedspacesItemProps {
  space: TSubscribedspaces,
  onDeleteSharedspace: (url: string) => void,
};

const SubscribedspacesItem: FC<TSubscribedspacesItemProps> = ({
  space,
  onDeleteSharedspace,
}) => {
  const navigate = useNavigate();
  const { Sharedspace } = space;
  const { name, url, private: privateBool, Owner } = Sharedspace;
  const { isOwner } = useUser();

  const {
    anchorEl,
    open,
    onOpen,
    onClose,
  } = useMenu();

  const onClickMoreMenu = (e: any) => {
    e.stopPropagation();
    onOpen(e);
  };

  const onCloseMoreMenu = (e: any) => {
    e.stopPropagation();
    onClose();
  };

  const onClickDelete = (e: any, url: string) => {
    onDeleteSharedspace(url);
    onCloseMoreMenu(e);
    toast.success(successMessage, {
      ...defaultToastOption,
    });
  };
  
  return (
    <Item
      onClick={() => navigate(`/sharedspaces/view/${url}`)}>
      <ItemPrivate>{privateBool ? <LockIcon /> : <UnlockIcon />}</ItemPrivate>
      <ItemTitle>{name}</ItemTitle>
      <ItemOwner>{Owner.email}</ItemOwner>
      {
        isOwner(url) ?
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
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
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