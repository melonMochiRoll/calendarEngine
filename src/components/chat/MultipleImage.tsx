import React, { FC } from 'react';
import styled from '@emotion/styled';
import { ModalName, TImages } from 'Typings/types';
import { useAppDispatch } from 'Hooks/reduxHooks';
import { openModal } from 'Features/modalSlice';
import ClearIcon from '@mui/icons-material/Clear';

interface MultipleImageProps {
  image: Pick<TImages, 'id' | 'path'>,
  isSender: boolean,
  deleteImage: () => void,
};

const MultipleImage: FC<MultipleImageProps> = ({
  image,
  isSender,
  deleteImage,
}) => {
  const dispatch = useAppDispatch();

  const openImageModal = () => {
    dispatch(openModal({
      name: ModalName.IMAGE_VIEWER,
      props: { path: image.path },
    }));
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