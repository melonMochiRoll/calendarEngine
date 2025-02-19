import React, { FC } from 'react';
import styled from '@emotion/styled';
import RenderUserProfile from 'Components/auth/RenderUserProfile';
import SatelliteIcon from '@mui/icons-material/SatelliteAlt';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {};

const Header: FC<HeaderProps> = ({}) => {
  const navigate = useNavigate();
  
  return (
    <Block>
      <Left>
        <FlexBox>
          <SatelliteIcon
            onClick={() => navigate('/sharedspaces/subscribed')}
            fontSize='large'
            sx={{ color: 'var(--blue)', cursor: 'pointer', marginRight: '10px' }}/>
        </FlexBox>
      </Left>
      <Right>
        <RenderUserProfile />
      </Right>
    </Block>
  );
};

export default Header;

const Block = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 5%;
  padding: 10px 5%;
  border-bottom: 1px solid var(--light-gray);
  background-color: var(--black);
`;

const Left = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 70%;
`;

const FlexBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 30%;
  gap: 12px;
`;