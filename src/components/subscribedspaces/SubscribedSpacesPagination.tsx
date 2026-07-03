import React, { FC } from 'react';
import styled from '@emotion/styled';
import ArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface SubscribedSpacesPaginationProps {
  currentPage: number,
  currentPageGroupCount: number,
  hasNextPageGroup: boolean,
  goToPage: (page: number) => void,
};

const SubscribedSpacesPagination: FC<SubscribedSpacesPaginationProps> = ({
  currentPage,
  currentPageGroupCount,
  hasNextPageGroup,
  goToPage,
}) => {
  const pages = Array.from({ length: Math.ceil(currentPageGroupCount / 7) }, (_, idx) => idx + 1);
  const currentPageGroup = Math.floor((currentPage - 1) / 10);

  return (
    <Nav>
      {
        currentPageGroup > 0 &&
        <PageButton
          onClick={() => goToPage(currentPageGroup * 10 - 9)}>
          <ArrowLeftIcon fontSize='small' />
        </PageButton>
      }
      {
        pages.map((page) => {
          return (
            <PageButton
              key={page}
              onClick={() => goToPage(page)}
              disabled={currentPage === page}>
              {page}
            </PageButton>
          );
        })
      }
      {
        hasNextPageGroup &&
        <PageButton
          onClick={() => goToPage((currentPageGroup + 1) * 10 + 1)}>
          <ArrowRightIcon fontSize='small' />
        </PageButton>
      }
    </Nav>
  );
};

export default SubscribedSpacesPagination;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
`;

const PageButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  font-size: 16px;
  color: var(--white); 
  background-color: ${({disabled}) => disabled ? `var(--google-blue)` : `var(--dark)`};
  border: none;
  border-radius: 5px;
  cursor: ${({disabled}) => disabled ? `auto` : `pointer`};

  &:hover {
    background-color:  ${({disabled}) => disabled ? `var(--google-blue)` : `var(--light-gray)`};
  }
`;