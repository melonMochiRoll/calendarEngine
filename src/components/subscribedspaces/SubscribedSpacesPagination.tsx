import React, { FC } from 'react';
import styled from '@emotion/styled';
import ArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface SubscribedSpacesPaginationProps {
  currentPage: number,
  totalCount: number,
  goToPage: (page: number) => void,
};

const SubscribedSpacesPagination: FC<SubscribedSpacesPaginationProps> = ({
  currentPage,
  totalCount,
  goToPage,
}) => {
  const ITEM_PER_PAGES = 7;
  const PAGES_MAXLENGTH = 10;
  const totalPages = Math.ceil(totalCount / ITEM_PER_PAGES);

  const firstPage = Math.floor((currentPage - 1) / PAGES_MAXLENGTH) * PAGES_MAXLENGTH + 1;
  const lastPage = Math.min(firstPage + PAGES_MAXLENGTH - 1, totalPages);

  const pages = Array.from(
    { length: Math.max(0, lastPage - firstPage + 1) },
    (_, idx) => firstPage + idx
  );

  return (
    <Nav>
      {
        firstPage > 1 &&
        <PageButton
          onClick={() => goToPage(firstPage - 1)}>
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
        totalPages > lastPage &&
        <PageButton
          onClick={() => goToPage(lastPage + 1)}>
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