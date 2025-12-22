import React, { FC } from 'react';
import styled from '@emotion/styled';
import { BaseModalProps } from 'Src/typings/types';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { closeModal } from 'Src/features/modalSlice';

export interface ImageViewerProps extends BaseModalProps {
  payload: {
    path: string,
  },
};

const ImageViewer: FC<ImageViewerProps> = ({
  payload,
  idx,
}) => {
  const { path } = payload;
  const dispatch = useAppDispatch();

  return (
    <Backdrop
      zIndex={100 + idx}
      isBottom={!idx}
      onClick={() => dispatch(closeModal())}>
      <Block onClick={e => e.stopPropagation()}>
        <Img
          src={`${process.env.REACT_APP_AWS_S3_BUCKET_URL}/${path}`}
          alt={path} />
      </Block>
    </Backdrop>
  );
};

export default ImageViewer;

const Backdrop = styled.div<{ zIndex: number, isBottom: boolean }>`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ isBottom }) => isBottom ? 'rgba(0, 0, 0, 0.8)' : ''};
  z-index: ${({ zIndex }) => zIndex};
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  background-color: var(--black);
  box-shadow: 1px 1px 10px 2px #000;
`;

const Img = styled.img`
  max-height: 600px;
  object-fit: contain;
  cursor: pointer;
`;