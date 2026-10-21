import React, { FC } from 'react';
import styled from '@emotion/styled';
import RenderUserProfile from 'Components/auth/RenderUserProfile';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowIcon from '@mui/icons-material/ArrowBackIos';

const Header: FC = () => {
  const navigate = useNavigate();
  const { ChatRoomId: _ChatRoomId } = useParams();

  return (
    <Block>
      <div>
        {_ChatRoomId &&
          <DirectMessageWrapper>
            <IconButton onClick={() => navigate('/')}>
              <ArrowIcon />
              <span>홈으로</span>
            </IconButton>
          </DirectMessageWrapper>
        }
      </div>
      <RenderUserProfile />
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
  padding: 30px 0;
  border-bottom: 1px solid var(--light-gray);
  background-color: var(--black);
`;

const DirectMessageWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  width: 300px;
  padding: 0 10px;
`;

const IconButton = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 35px;
  padding: 5px 10px;
  color: var(--gray-5);
  border-radius: 8px;
  cursor: pointer;

  svg {
    margin-right: 10px;
  }

  span {
    font-size: 16px;
    font-weight: 600;
    text-align: center;
  }

  &:hover {
    color: var(--white);
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const CenterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  flex-shrink: 1;
  align-items: center;
  padding: 0 25px;
`;