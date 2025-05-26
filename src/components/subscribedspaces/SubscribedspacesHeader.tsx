import React, { FC } from 'react';
import styled from '@emotion/styled';
import useMenu from 'Hooks/utils/useMenu';
import { createSharedspace } from 'Api/sharedspacesApi';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'Constants/paths';
import AddIcon from '@mui/icons-material/Add';
import HelpIcon from '@mui/icons-material/HelpRounded';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Menu, MenuItem, Tooltip } from '@mui/material';
import { privateTooltip } from 'Constants/notices';
import { SubscribedspacesSortOptions, TUser } from 'Typings/types';

interface SubscribedSpacesHeaderProps {
  userData: TUser;
  optionText: string;
  setOption: React.Dispatch<React.SetStateAction<typeof SubscribedspacesSortOptions[0]>>
};

const SubscribedSpacesHeader: FC<SubscribedSpacesHeaderProps> = ({
  userData,
  optionText,
  setOption,
}) => {
  const navigate = useNavigate();

  const {
    anchorEl,
    open,
    onOpen,
    onClose,
  } = useMenu();
  
  const onMenuClick = (value: typeof SubscribedspacesSortOptions[0]) => {
    setOption(value);
    onClose();
  };

  const onCreateSharedspace = async (UserId: number) => {
    const spaceUrl = await createSharedspace(UserId);

    navigate(`${PATHS.SHAREDSPACE_VIEW}/${spaceUrl}`);
  };

  return (
    <Header>
      <TitleWrapper>
        <Title>스페이스 목록</Title>
        <AddButton onClick={() => onCreateSharedspace(userData.id)}>
          <AddIcon fontSize='large' sx={{ color: 'var(--blue)' }}/>
          <span>새 스페이스</span>
        </AddButton>
      </TitleWrapper>
      <ListHeader>
        <ItemHead>
          <Tooltip title={privateTooltip} sx={{ fontSize: '24px' }} arrow>
            <ItemPrivate>
              <span>공개 여부</span>
              <HelpIcon fontSize='small' sx={{ color: 'var(--blue)' }} />
            </ItemPrivate>
          </Tooltip>
          <ItemTitle>스페이스 이름</ItemTitle>
          <ItemOwner onClick={onOpen}>
            {optionText}
            <ArrowDropDownIcon fontSize='large' />
          </ItemOwner>
          <Menu
            aria-labelledby='demo-positioned-button'
            anchorEl={anchorEl}
            open={open}
            onClick={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{ marginTop: '10px' }}>
            {
              SubscribedspacesSortOptions.map((option, idx) => {
                return (
                  <MenuItem
                    key={option.text}
                    onClick={() => onMenuClick(SubscribedspacesSortOptions[idx])}>
                    <span>{option.text}</span>
                  </MenuItem>
                );
              })
            }
          </Menu>
          <ItemMoreMenu />
        </ItemHead>
      </ListHeader>
    </Header>
  );
};

export default SubscribedSpacesHeader;

const Header = styled.header``;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3% 20%;
  border-bottom: 1px solid var(--light-gray);
`;

const Title = styled.h1`
  font-size: 54px;
  color: var(--white);
  margin: 0;
`;

const AddButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  padding-left: 10px;
  padding-right: 15px;
  font-size: 18px;
  font-weight: 600;
  color: var(--white);
  border: 1px solid var(--white);
  border-radius: 25px;
  transition: all 0.3s;
  cursor: pointer;
  gap: 5px;

  &:hover {
    border-color: var(--blue);
  }
`;

const ListHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 20%;
  border-bottom: 1px solid var(--light-gray);
`;

const ItemHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px 30px;
  color: #fff;
  font-weight: 600;
`;

const ItemPrivate = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10%;
  font-size: 20px;
  text-align: center;
  cursor: help;
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
  cursor: pointer;
`;