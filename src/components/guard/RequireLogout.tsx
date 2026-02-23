import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'Src/constants/paths';
import useUser from 'Src/hooks/queries/useUser';

interface RequireLogoutProps {
  children: React.ReactNode
};

const RequireLogout: FC<RequireLogoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { data: userData } = useUser({ suspense: true, throwOnError: false });

  useEffect(() => {
    if (userData) {
      navigate(PATHS.SHAREDSPACE);
    }
  }, [userData]);

  return children;
};

export default RequireLogout;