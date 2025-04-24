import { PATHS } from 'Constants/paths';
import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage: FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate(PATHS.SHAREDSPACE);
  }, []);

  return <></>;
};

export default MainPage;