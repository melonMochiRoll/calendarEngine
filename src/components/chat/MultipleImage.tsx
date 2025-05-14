import React, { FC } from 'react';
import styled from '@emotion/styled';
import { ModalName, TImages } from 'Typings/types';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from 'Hooks/reduxHooks';
import { setImagePath } from 'Features/imageViewerSlice';
import { openModal } from 'Features/modalSlice';
import { deleteSharedspaceChatImage } from 'Api/sharedspacesApi';
import ClearIcon from '@mui/icons-material/Clear';

interface MultipleImageProps {
  isSender: boolean,
  ChatId: number,
  image: Pick<TImages, 'id' | 'path'>,
};

const MultipleImage: FC<MultipleImageProps> = ({
  isSender,
  ChatId,
  image,
}) => {
  const { url } = useParams();
  const dispatch = useAppDispatch();

  const deleteImage = () => {
    deleteSharedspaceChatImage(url, ChatId, image.id)
      .catch(() => {});
  };

  const openImageModal = () => {
    dispatch(setImagePath(image.path));
    dispatch(openModal({ name: ModalName.IMAGE_VIEWER }));
  };

  return (
    <Block>
      <Image
        onClick={openImageModal}
        src={`${process.env.REACT_APP_AWS_S3_BUCKET_URL}/${image.path}`}/>
      {isSender &&
        <Buttons>
          <Button onClick={deleteImage}>
            <ClearIcon />
          </Button>
        </Buttons>
      }
    </Block>
  );
};

export default MultipleImage;

const Block = styled.div`
  position: relative;

  &:hover {
    div {
      display: block;
    }
  }
`;

const Image = styled.img`
  width: 180px;
  height: 180px;
  border-radius: 12px;
  object-fit: cover;
  cursor: pointer;
`;

const Buttons = styled.div`
  position: absolute;
  display: none;
  top: 0;
  right: 0;
  padding: 10px;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  color: var(--gray-5);
  border: none;
  border-radius: 12px;
  background-color: var(--gray-8);
  cursor: pointer;

  &:hover {
    color: var(--white);
    background-color: var(--red);
  }
`;