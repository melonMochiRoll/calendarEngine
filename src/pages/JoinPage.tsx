import React, { FC } from 'react';
import JoinContainer from 'Containers/JoinContainer';
import WithGuestGuard from 'Components/hoc/WithGuestGuard';

const JoinPage: FC = () => {
  return (
    <JoinContainer />
  );
};

export default WithGuestGuard(JoinPage);