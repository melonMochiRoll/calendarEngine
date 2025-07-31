import { useDeferredValue, useState } from "react";

const useMenu = () => {
  const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);
  const deferredInput = useDeferredValue(anchorEl);

  const onOpen = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  return {
    anchorEl: deferredInput,
    open: !!anchorEl,
    onOpen,
    onClose,
  } as const;
};

export default useMenu;