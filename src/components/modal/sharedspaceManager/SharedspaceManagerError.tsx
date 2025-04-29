import React, { FC } from 'react';
import styled from '@emotion/styled';
import ErrorIcon from '@mui/icons-material/ErrorOutline';

interface SharedspaceManagerErrorProps {
  message: string;
};

const SharedspaceManagerError: FC<SharedspaceManagerErrorProps> = ({
  message,
}) => {
  return (
    <Block>
      <ErrorIcon sx={ErrorInlineStyle} />
      <NotFoundMessage>{message}</NotFoundMessage>
    </Block>
  );
};

export default SharedspaceManagerError;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 85%;
`;

const ErrorInlineStyle = {
  color: 'var(--white)',
  fontSize: '64px',
  paddingBottom: '15px',
};

const NotFoundMessage = styled.span`
  color: var(--white);
  font-size: 20px;
  font-weight: 600;
`;