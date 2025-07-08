import React, { FC } from 'react';
import styled from '@emotion/styled';

interface MenuButtonProps {
  type: 'submit' | 'reset' | 'button' | undefined;
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  bgColor?: string;
};

const MenuButton: FC<MenuButtonProps> = ({
  type,
  onClick,
  children,
  filled = false,
  bgColor = 'var(--purple)',
}) => {
  return (
    <Button
      onClick={onClick}
      type={type}
      filled={filled}
      bgColor={bgColor}>
      {children}
    </Button>
  );
};

export default MenuButton;

const Button = styled.button<{ filled: boolean, bgColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 100px;
  height: 40px;
  padding: 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background-color: ${({filled, bgColor}) => filled ? `rgba(0, 0, 0, 0)` : bgColor};
  border: ${({filled, bgColor}) => filled ? `none` : `2px solid ${bgColor}`} ;
  border-radius: 10px;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${({filled, bgColor}) => filled ? bgColor : `rgba(0, 0, 0, 0)`};
  }
`;