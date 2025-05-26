import { useCallback, useState } from "react";

const useInput = <T>(initData: T) => {
  const [ state, setState ] = useState(initData);
  
  const onChangeState = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setState(e.target.value as T);
  }, [state]);

  return [ state, onChangeState, setState ] as const;
};

export default useInput;