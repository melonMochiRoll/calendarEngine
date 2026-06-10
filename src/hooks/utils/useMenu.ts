import { useState } from "react";

const useMenu = () => {
  const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);

  const onOpen = (e: any) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const onClose = (e: any) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  return {
    anchorEl,
    open: !!anchorEl,
    onOpen,
    onClose,
  } as const;
};

export default useMenu;