import React, { FC, Suspense } from 'react';
import styled from '@emotion/styled';
import RenderUserProfile from 'Components/auth/RenderUserProfile';
import SkeletonUserProfile from 'Src/components/async/skeleton/SkeletonUserProfile';
import TextButton from 'Src/components/common/TextButton';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { ModalName } from 'Src/typings/types';
import { openModal } from 'Src/features/modalSlice';

const Header: FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Block>
      <TextButton
        type='button'
        onClick={() => {
          dispatch(openModal({ name: ModalName.SHAREDSPACE_INVITE_RECEIVED }));
        }}>
        받은 초대
      </TextButton>
      <Suspense fallback={<SkeletonUserProfile />}>
        <RenderUserProfile />
      </Suspense>
    </Block>
  );
};

export default Header;

const Block = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50px;
  padding: 10px 5%;
  border-bottom: 1px solid var(--light-gray);
  background-color: var(--black);
`;