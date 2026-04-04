import React, { FC } from 'react';
import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/CloseRounded';

interface ImagePreviewerProps {
  previews: string[],
  deleteFile: (idx: number) => void,
};

const ImagePreviewer: FC<ImagePreviewerProps> = ({
  previews,
  deleteFile,
}) => {
  return (
    <Block>
      <Items>
        {
          previews.map((preview, idx) => {
            return (
              <Item key={idx}>
                <ImgCover onClick={() => deleteFile(idx)}>
                  <CloseIcon
                    sx={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '100px'
                    }}/>
                </ImgCover>
                <Img src={preview} />
              </Item>
            );
          })
        }
      </Items>
    </Block>
  );
};

export default ImagePreviewer;

const Block = styled.div`
  padding: 20px 20px 0 20px;
`;

const Items = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 20px;
  border-radius: 12px;
  background-color: var(--gray-8);
  gap: 10px;
`;

const Item = styled.li`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 180px;
  height: 180px;
  border-radius: 12px;
  background-color: var(--gray-7);

  &:hover {
    div {
      visibility: visible;
    }
  }
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ImgCover = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  visibility: hidden;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.3);
  cursor: pointer;

  &:hover {
    visibility: visible;
  }
`;