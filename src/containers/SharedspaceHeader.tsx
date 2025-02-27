import React, { FC } from 'react';
import styled from '@emotion/styled';
import RenderUserProfile from 'Components/auth/RenderUserProfile';
import SatelliteIcon from '@mui/icons-material/SatelliteAlt';
import { useNavigate } from 'react-router-dom';
import { ModalName, TSharedspaceMetaData } from 'Typings/types';
import { updateSharedspaceName } from 'Api/sharedspacesApi';
import useUser from 'Hooks/useUser';
import { useQueryClient } from '@tanstack/react-query';
import { GET_SHAREDSPACE_KEY } from 'Lib/queryKeys';
import EditableTitle from 'Components/common/EditableTitle';
import { useAppDispatch } from 'Hooks/reduxHooks';
import { openModal } from 'Features/modalSlice';
import ProfileImage from 'Components/ProfileImage';

interface SharedspaceHeaderHeaderProps {
  spaceData: TSharedspaceMetaData,
};

const SharedspaceHeader: FC<SharedspaceHeaderHeaderProps> = ({
  spaceData,
}) => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  const { isOwner } = useUser();
  const { name, Sharedspacemembers } = spaceData;

  const onUpdateSharedspaceName = async (name: string) => {
    if (spaceData?.name === name) {
      return;
    }

    await updateSharedspaceName(name, spaceData?.url);
    await qc.refetchQueries([GET_SHAREDSPACE_KEY]);
  };
  
  return (
    <Block>
      <Left>
        <FlexBox>
          <SatelliteIcon
            onClick={() => navigate('/sharedspaces/subscribed')}
            fontSize='large'
            sx={{ color: 'var(--blue)', cursor: 'pointer', marginRight: '10px' }}/>
          {
            isOwner() ?
            <EditableTitle
              initValue={name}
              submitEvent={onUpdateSharedspaceName}/>
              :
            <SpaceTitle>{name}</SpaceTitle>
          }
        </FlexBox>
        {Sharedspacemembers &&
          <FlexBox onClick={() => dispatch(openModal(ModalName.SHAREDSPACEMEMBERLIST))}>
            {
              Sharedspacemembers
                .slice(0, 5)
                .map((member: typeof spaceData.Sharedspacemembers[0], idx: number) => {
                  const { User } = member;

                  return <ProfileImage
                    key={User.email}
                    profileImage={User.profileImage}
                    email={User.email} />;
                })
            }
            {Sharedspacemembers.length - 5 > 0 && <RestUserImg>{`+${Sharedspacemembers.length - 5}`} </RestUserImg>}
          </FlexBox>}
      </Left>
      <Right>
        <RenderUserProfile />
      </Right>
    </Block>
  );
};

export default SharedspaceHeader;

const Block = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5%;
  padding: 10px 5%;
  border-bottom: 1px solid var(--light-gray);
  background-color: var(--black);
  z-index: 1;
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

const SpaceTitle = styled.h1`
  font-size: 28px;
  color: var(--white);
  margin: 0;
`;

const RestUserImg = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: var(--white);
  width: 35px;
  height: 35px;
  border-radius: 35px;
  background-color: var(--light-gray);
  cursor: pointer;
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 30%;
  gap: 15px;
`;

const IconButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: var(--black);
  padding: 3px;
  border: none;
  border-radius: 15px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;