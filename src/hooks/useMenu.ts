import { useState } from "react";

const useMenu = () => {
  const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const onOpen = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  return {
    anchorEl,
    open,
    onOpen,
    onClose,
  } as const;
};

export default useMenu;