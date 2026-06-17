import React, { FC } from 'react';
import styled from '@emotion/styled';
import RenderUserProfile from 'Components/auth/RenderUserProfile';
import { ModalName } from 'Typings/types';
import { useAppDispatch } from 'Hooks/reduxHooks';
import { openModal } from 'Features/modalSlice';
import TextButton from 'Src/components/common/TextButton';
import RenderSpaceTitle from 'Src/components/layouts/RenderSpaceTitle';

interface SharedspaceHeaderProps {};

const SharedspaceHeader: FC<SharedspaceHeaderProps> = ({}) => {
  const dispatch = useAppDispatch();
  
  return (
    <Header>
      <DirectMessageWrapper>
      </DirectMessageWrapper>
      <SpaceInfoWrapper>
        <RenderSpaceTitle />
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
  padding: 30px 0;
  border-bottom: 1px solid var(--light-gray);
  background-color: var(--black);
  z-index: 1;
`;

const DirectMessageWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  width: 250px;
`;

const SpaceInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  flex-shrink: 1;
  align-items: center;
  padding: 0 25px;
`;