import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { useSharedspace } from 'Hooks/queries/useSharedspace';
import { updateSharedspacePrivate } from 'Api/sharedspacesApi';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { GET_SHAREDSPACE_KEY } from 'Constants/queryKeys';
import { waitingMessage } from 'Constants/notices';
import ShieldIcon from '@mui/icons-material/VerifiedUser';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import useMenu from 'Hooks/utils/useMenu';
import { Menu, MenuItem } from '@mui/material';

interface SharedspaceManagerMainProps {};

const SharedspaceManagerMain: FC<SharedspaceManagerMainProps> = ({}) => {
  const { url } = useParams();
  const qc = useQueryClient();

  const { data: spaceData } = useSharedspace();
  const [ error, setError ] = useState('');

  const {
    anchorEl,
    open,
    onOpen,
    onClose,
  } = useMenu();

  const handleUpdateSharedspacePrivate = async (e: React.MouseEvent<HTMLLIElement, MouseEvent>, Private: boolean) => {
    e.stopPropagation();
    onClose();

    try {
      await updateSharedspacePrivate(url, Private);
      await qc.refetchQueries([GET_SHAREDSPACE_KEY, url]);
    } catch (err) {
      setError(waitingMessage);
    }
  };

  const renderPrivateText = (status: boolean) => {
    return status ? '권한이 있는 유저' : '모든 유저';
  };

  return (
    <Main>
      <PrivateDiv>
        <Top>
          <ShieldIcon fontSize='large' sx={{ marginRight: '15px' }}/>
          <Title>액세스 권한 설정</Title>
        </Top>
        <Bottom>
          <Span>이 스페이스를</Span>
          <PrivateSwitch
            onClick={onOpen}>
            {renderPrivateText(spaceData.private)}
            <ArrowDropDownIcon fontSize='large' />
          </PrivateSwitch>
          <Menu
            aria-labelledby='demo-positioned-button'
            anchorEl={anchorEl}
            open={open}
            onClick={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{ marginTop: '10px' }}>
            {
              <MenuItem
                onClick={(e) => handleUpdateSharedspacePrivate(e, !spaceData.private)}
                sx={{ fontSize: '20px', fontWeight: '500' }}>
                <span>{renderPrivateText(!spaceData.private)}</span>
              </MenuItem>
            }
          </Menu>
          <Span>가 접근하도록 합니다.</Span>
        </Bottom>
      </PrivateDiv>
      {error && <ErrorSpan>{error}</ErrorSpan>}
    </Main>
  );
};

export default SharedspaceManagerMain;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 85%;
  color: var(--white);
  padding: 1% 0;
`;

const ErrorSpan = styled.span`
  font-size: 16px;
  color: var(--red);
`;

const PrivateDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
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