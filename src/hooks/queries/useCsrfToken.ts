import { getCsrfToken } from "Src/api/authApi";
import { useAppDispatch, useAppSelector } from "../reduxHooks";
import { setCsrfToken } from "Src/features/csrfTokenSlice";
import { useEffect } from "react";

export function useCsrfToken() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector(state => state.csrfToken);

  useEffect(() => {
    if (!token) {
      getCsrfToken()
        .then((token) => {
          dispatch(setCsrfToken({ token }));
        });
    }
  }, [token]);
}