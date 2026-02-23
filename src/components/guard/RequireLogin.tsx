import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'Src/constants/paths';
import useUser from 'Src/hooks/queries/useUser';

interface RequireLoginProps {
  children: React.ReactNode
};

const RequireLogin: FC<RequireLoginProps> = ({ children }) => {
  const navigate = useNavigate();
  const { data: userData } = useUser({ suspense: true, throwOnError: false });

  useEffect(() => {
    if (!userData) {
      navigate(PATHS.LOGIN);
    }
  }, [userData]);

  return children;
};

export default RequireLogin;