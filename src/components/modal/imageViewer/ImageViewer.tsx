import React, { FC } from 'react';
import styled from '@emotion/styled';

export interface ImageViewerProps {
  path: string,
};

const ImageViewer: FC<ImageViewerProps> = ({
  path,
}) => {
  return (
    <Block onClick={e => e.stopPropagation()}>
      <Img
        src={path}
        alt={path} />
    </Block>
  );
};

export default ImageViewer;

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