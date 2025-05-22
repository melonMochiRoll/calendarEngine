import React, { FC } from 'react';
import styled from '@emotion/styled';
import RenderUserProfile from 'Components/auth/RenderUserProfile';
import SatelliteIcon from '@mui/icons-material/SatelliteAlt';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'Constants/paths';
import useUser from 'Hooks/useUser';

const Header: FC = () => {
  const navigate = useNavigate();
  const { data: userData } = useUser({ suspense: true, throwOnError: true });
  
  return (
    <HeaderBlock>
      <InfoWrapper>
        <FlexBox>
          <SatelliteIcon
            onClick={() => navigate(PATHS.SHAREDSPACE)}
            fontSize='large'
            sx={{ color: 'var(--blue)', cursor: 'pointer', marginRight: '10px' }}/>
        </FlexBox>
      </InfoWrapper>
      <ProfileWrapper>
        <RenderUserProfile userData={userData} />
      </ProfileWrapper>
    </HeaderBlock>
  );
};

export default Header;

const HeaderBlock = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50px;
  padding: 10px 5%;
  border-bottom: 1px solid var(--light-gray);
  background-color: var(--black);
`;

const InfoWrapper = styled.div`
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

const ProfileWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 30%;
  gap: 12px;
`;