import React, { FC, Suspense } from 'react';
import styled from '@emotion/styled';
import RenderUserProfile from 'Components/auth/RenderUserProfile';
import SatelliteIcon from '@mui/icons-material/SatelliteAlt';
import { useNavigate } from 'react-router-dom';
import { ModalName } from 'Typings/types';
import { useAppDispatch } from 'Hooks/reduxHooks';
import { openModal } from 'Features/modalSlice';
import { PATHS } from 'Constants/paths';
import TextButton from 'Src/components/common/TextButton';
import RenderSpaceTitle from 'Src/components/layouts/RenderSpaceTitle';

interface SharedspaceHeaderProps {};

const SharedspaceHeader: FC<SharedspaceHeaderProps> = ({}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  return (
    <Header>
      <SpaceInfoWrapper>
        <FlexBox>
          <SatelliteIcon
            onClick={() => navigate(PATHS.SHAREDSPACE)}
            fontSize='large'
            sx={SatelliteIconInlineStyle} />
          <RenderSpaceTitle />
        </FlexBox>
        <TextButton
          type='button'
          onClick={() => dispatch(openModal({ name: ModalName.SHAREDSPACEMEMBERLIST }))}>
          멤버 목록
        </TextButton>
      </SpaceInfoWrapper>
      <RenderUserProfile />
    </Header>
  );
};

export default SharedspaceHeader;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 10px 5%;
  border-bottom: 1px solid var(--light-gray);
  background-color: var(--black);
  z-index: 1;
`;

const SpaceInfoWrapper = styled.div`
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

const SatelliteIconInlineStyle = {
  color: 'var(--blue)',
  cursor: 'pointer',
  marginRight: '10px',
};