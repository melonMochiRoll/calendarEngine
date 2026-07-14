import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { closeModal } from 'Src/features/modalSlice';
import GroupIcon from '@mui/icons-material/Group';
import CloseIcon from '@mui/icons-material/CloseRounded';

interface FriendshipsHeaderProps {
  tabs: string[],
  currentTab: string,
  switchTab: (tab: string) => void,
};

const FriendshipsHeader: FC<FriendshipsHeaderProps> = ({
  tabs,
  currentTab,
  switchTab,
}) => {
  const dispatch = useAppDispatch();

  return (
    <>
      <Header>
        <Left></Left>
        <Center>
          <GroupIcon fontSize='large' />
          <ModalTitle>친구 목록</ModalTitle>
        </Center>
        <Right>
          <CloseIcon
            onClick={() => dispatch(closeModal())}
            sx={CloseIconInlineStyle} />
        </Right>
      </Header>
      <Tabs>
        {tabs.map((tab) => {
          return (
            <Tab
              key={tab}
              onClick={() => switchTab(tab)}
              active={currentTab === tab}>
              {tab}
            </Tab>
          );
        })}
      </Tabs>
    </>
  );
};

export default FriendshipsHeader;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 15%;
  padding: 20px 0;
  border-bottom: 1px solid var(--light-gray);
`;

const Left = styled.div`
  width: 15%;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  color: var(--white);
  gap: 15px;
`;

const ModalTitle = styled.h1`
  color: var(--white);
  font-size: 24px;
  font-weight 600;
  margin: 0;
`;

const Right = styled.div`
  display: flex;
  justify-content: center;
  width: 15%;
`;

const CloseIconInlineStyle = {
  color: 'var(--white)',
  fontSize: '35px',
  cursor: 'pointer',
};

const Tabs = styled.div`
  display: flex;
  justify-content: stretch;
  width: 100%;
  height: 50px;
`;

const Tab = styled.div<{ active: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: ${({ active }) => active ? 'var(--blue)' : 'var(--gray-6)'};
  font-size: 18px;
  font-weight: 600;
  border-right: 1px solid var(--light-gray);
  border-bottom: 1px solid var(--light-gray);
  cursor: pointer;
`;