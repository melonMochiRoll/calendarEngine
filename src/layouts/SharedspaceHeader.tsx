import React, { FC } from 'react';
import styled from '@emotion/styled';
import RenderUserProfile from 'Components/auth/RenderUserProfile';
import SatelliteIcon from '@mui/icons-material/SatelliteAlt';
import { useNavigate, useParams } from 'react-router-dom';
import { ModalName } from 'Typings/types';
import { updateSharedspaceName } from 'Api/sharedspacesApi';
import useUser from 'Hooks/queries/useUser';
import { useQueryClient } from '@tanstack/react-query';
import { GET_SHAREDSPACE_KEY } from 'Constants/queryKeys';
import EditableTitle from 'Components/common/EditableTitle';
import { useAppDispatch } from 'Hooks/reduxHooks';
import { openModal } from 'Features/modalSlice';
import ProfileImage from 'Components/ProfileImage';
import { PATHS } from 'Constants/paths';
import { useSharedspace } from 'Hooks/queries/useSharedspace';

interface SharedspaceHeaderProps {};

const SharedspaceHeader: FC<SharedspaceHeaderProps> = ({}) => {
  const { data: userData, isOwner } = useUser({ suspense: true, throwOnError: true });
  const { data: spaceData } = useSharedspace();

  const navigate = useNavigate();
  const qc = useQueryClient();
  const { url } = useParams();
  const dispatch = useAppDispatch();

  const onUpdateSharedspaceName = async (name: string) => {
    if (spaceData?.name === name) {
      return;
    }

    await updateSharedspaceName(name, spaceData?.url);
    await qc.refetchQueries([GET_SHAREDSPACE_KEY, spaceData?.url]);
  };
  
  return (
    <HeaderBlock>
      <SpaceInfoWrapper>
        <FlexBox>
          <SatelliteIcon
            onClick={() => navigate(PATHS.SHAREDSPACE)}
            fontSize='large'
            sx={SatelliteIconInlineStyle} />
          {
            isOwner(url) ?
            <EditableTitle
              initValue={spaceData.name}
              submitEvent={onUpdateSharedspaceName}/>
              :
            <SpaceTitle>{spaceData.name}</SpaceTitle>
          }
        </FlexBox>
        {spaceData.Sharedspacemembers &&
          <FlexBox onClick={() => dispatch(openModal({ name: ModalName.SHAREDSPACEMEMBERLIST }))}>
            {
              spaceData.Sharedspacemembers
                .slice(0, 5)
                .map((member: typeof spaceData.Sharedspacemembers[0], idx: number) => {
                  const { User } = member;

                  return <ProfileImage
                    key={User.email}
                    profileImage={User.profileImage}
                    email={User.email} />;
                })
            }
            {spaceData.Sharedspacemembers.length - 5 > 0 && <RestUserImg>{`+${spaceData.Sharedspacemembers.length - 5}`} </RestUserImg>}
          </FlexBox>}
      </SpaceInfoWrapper>
      <ProfileWrapper>
        <RenderUserProfile userData={userData} />
      </ProfileWrapper>
    </HeaderBlock>
  );
};

export default SharedspaceHeader;

const HeaderBlock = styled.header`
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

const ProfileWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 30%;
  gap: 15px;
`;

const SatelliteIconInlineStyle = {
  color: 'var(--blue)',
  cursor: 'pointer',
  marginRight: '10px',
};

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