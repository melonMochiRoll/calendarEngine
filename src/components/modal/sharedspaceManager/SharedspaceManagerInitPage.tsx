import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import ShieldIcon from '@mui/icons-material/VerifiedUser';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useQueryClient } from '@tanstack/react-query';
import useMenu from 'Hooks/utils/useMenu';
import { updateSharedspacePrivate } from 'Api/sharedspacesApi';
import { Menu, MenuItem } from '@mui/material';
import { GET_SHAREDSPACE_KEY } from 'Constants/queryKeys';
import { TSharedspaceMetaData } from 'Typings/types';
import PeopleIcon from '@mui/icons-material/PeopleAltRounded';
import MemberItem from './MemberItem';

const privateOption = [
  {
    text: '권한이 있는 유저',
    filter: true,
  },
  {
    text: '모든 유저',
    filter: false,
  },
];

interface SharedspaceManagerInitPageProps {
  spaceData: TSharedspaceMetaData,
};

const SharedspaceManagerInitPage: FC<SharedspaceManagerInitPageProps> = ({
  spaceData,
}) => {
  const qc = useQueryClient();
  const [ option, setOption ] = useState<{ text: string, filter: boolean }>(spaceData?.private ? privateOption[0] : privateOption[1]);

  const {
    anchorEl,
    open,
    onOpen,
    onClose,
  } = useMenu();

  const onMenuClick = async (value: { text: string, filter: boolean }) => {
    setOption(value);

    await updateSharedspacePrivate(spaceData?.url, value?.filter);
    await qc.refetchQueries([GET_SHAREDSPACE_KEY, spaceData?.url]);
    onClose();
  };

  return (
    <Main>
      <MemberDiv>
        <Top>
          <PeopleIcon fontSize='large' sx={{ marginRight: '15px' }}/>
          <Title>권한이 있는 유저</Title>
        </Top>
        <MembersUl>
          {spaceData.Sharedspacemembers.map((user) => {
            return (
              <MemberItem
                key={user.UserId}
                OwnerData={spaceData.Owner}
                SharedspaceMembersAndUser={user} />
            );
          })}
        </MembersUl>
      </MemberDiv>
      <PrivateDiv>
        <Top>
          <ShieldIcon fontSize='large' sx={{ marginRight: '15px' }}/>
          <Title>액세스 권한 설정</Title>
        </Top>
        <Bottom>
          <Span>이 스페이스를</Span>
          <PrivateSwitch
            onClick={onOpen}>
            {option.text}
            <ArrowDropDownIcon fontSize='large' />
          </PrivateSwitch>
          <Menu
            aria-labelledby='demo-positioned-button'
            anchorEl={anchorEl}
            open={open}
            onClick={onClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            sx={{ marginTop: '10px' }}>
            {
              privateOption.map((option, idx) => {
                return (
                  <MenuItem
                    key={option.text}
                    onClick={() => onMenuClick(privateOption[idx])}
                    sx={{
                      fontSize: '20px',
                      fontWeight: '500',
                    }}>
                    <span>{option.text}</span>
                  </MenuItem>
                );
              })
            }
          </Menu>
          <Span>가 접근하도록 합니다.</Span>
        </Bottom>
      </PrivateDiv>
    </Main>
  );
};

export default SharedspaceManagerInitPage;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 85%;
  color: var(--white);
  padding: 1% 0;
`;

const MemberDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 60%;
  padding-top: 2%;
`;

const PrivateDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 40%;
`;

const MembersUl = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0;
  margin: 0;
  overflow-y: auto;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 0 5%;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 500;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 5%;
`;

const PrivateSwitch = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 220px;
  font-size: 24px;
  font-weight: 500;
  padding-bottom: 2px;
  border-bottom: 1px solid var(--white);
  cursor: pointer;
`;

const Span = styled.span`
  font-size: 22px;
`;