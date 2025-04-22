import { useCallback, useState } from "react";

const useInput = <T>(initData: T) => {
  const [ state, setState ] = useState(initData);
  
  const onChangeState = useCallback((e: any) => {
    setState(e.target.value);
  }, [state]);

  return [ state, onChangeState, setState ] as const;
};

export default useInput;