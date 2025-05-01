import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import HideIcon from '@mui/icons-material/LastPage';
import ShowIcon from '@mui/icons-material/FirstPage';

interface DrawerProps {
  children: React.ReactNode;
};

const Drawer: FC<DrawerProps> = ({ children }) => {
  const [ open, setOpen ] = useState(true);

  const toggleDrawer = () => {
    setOpen(prev => !prev);
  };

  return (
    <Block isShow={open}>
      <Header>
        {open ?
          <HideIcon
            onClick={toggleDrawer}
            sx={IconInlineStyle} /> :
          <ShowIcon
            onClick={toggleDrawer}
            sx={IconInlineStyle} />}
      </Header>
      {open && children}
    </Block>
  );
};

export default Drawer;

const Block = styled.div<{ isShow: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({isShow}) => isShow ? '30%' : '50px'};
  height: 100%;
  padding-top: 10px;
  padding-left: 10px;
  border: 1px solid var(--light-gray);
  background-color: var(--dark-gray);
  overflow: hidden;
`;

const Header = styled.div`
  svg {
    color: var(--white);
    border-radius: 8px;
    cursor: pointer;
  }

  svg:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const IconInlineStyle = {
  fontSize: '30px',
};