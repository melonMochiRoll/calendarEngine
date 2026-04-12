import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useSharedspace } from 'Src/hooks/queries/useSharedspace';
import { GET_SHAREDSPACE_KEY } from 'Src/constants/queryKeys';
import { useQueryClient } from '@tanstack/react-query';
import { updateSharedspaceName } from 'Src/api/sharedspacesApi';
import EditableTitle from '../common/EditableTitle';
import { toast } from 'react-toastify';
import { defaultToastOption, waitingMessage } from 'Src/constants/notices';

const RenderSpaceTitle: FC = () => {
  const qc = useQueryClient();
  const { data: spaceData } = useSharedspace();
  const { permission } = spaceData;

  const onUpdateSharedspaceName = async (name: string) => {
    if (spaceData?.name === name) {
      return;
    }

    try {
      await updateSharedspaceName(name, spaceData?.url);
      await qc.refetchQueries([GET_SHAREDSPACE_KEY, spaceData?.url]);
    } catch (err) {
      toast.error(waitingMessage, {
        ...defaultToastOption,
      });
    }
  };

  return (
    <>
      {
        permission.isOwner ?
        <EditableTitle
          initValue={spaceData.name}
          submitEvent={onUpdateSharedspaceName}/>
          :
        <SpaceTitle>{spaceData.name}</SpaceTitle>
      }
    </>
  );
};

export default RenderSpaceTitle;

const SpaceTitle = styled.h1`
  font-size: 28px;
  color: var(--white);
  margin: 0;
`;