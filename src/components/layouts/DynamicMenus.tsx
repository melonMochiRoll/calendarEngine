import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { openModal } from 'Src/features/modalSlice';
import { ModalName } from 'Src/typings/types';
import PublicIcon from '@mui/icons-material/Public';
import MailIcon from '@mui/icons-material/Mail';
import MailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useSharedspace } from 'Src/hooks/queries/useSharedspace';

const DynamicMenus: FC = () => {
  const dispatch = useAppDispatch();
  const { data: spaceData } = useSharedspace();
  const { permission } = spaceData;

  return (
    <>
      {
        permission.isOwner &&
        <IconButton onClick={() => dispatch(openModal({ name: ModalName.SHAREDSPACEMANAGER }))}>
          <Icon>
            <PublicIcon />
          </Icon>
          <span>채널 관리</span>
        </IconButton>
      }
      {
        permission.isOwner &&
        <IconButton onClick={() => dispatch(openModal({ name: ModalName.JOINREQUEST_MANAGER }))}>
          <Icon>
            <MailIcon />
          </Icon>
          <span>권한 요청 관리</span>
        </IconButton>
      }
      {
        !permission.isMember &&
        <IconButton onClick={() => dispatch(openModal({ name: ModalName.JOINREQUEST_SENDER }))}>
          <Icon>
            <MailReadIcon />
          </Icon>
          <span>권한 요청</span>
        </IconButton>
      }
    </>
  );
};

export default DynamicMenus;

const IconButton = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--white);
  cursor: pointer;

  span {
    font-size: 14px;
    padding-top: 5px;
    text-align: center;
  }
`;

const Icon = styled.div<{ active?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  border-radius: 8px;
  ${({ active }) => active ? 'background-color: rgba(255, 255, 255, 0.1);' : ''}

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;