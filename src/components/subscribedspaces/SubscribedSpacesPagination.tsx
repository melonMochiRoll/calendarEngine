import React, { FC, useEffect, useState } from 'react';
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
  const [ pages, setPages ] = useState([[0]]);
  const currentPagesIdx = Math.floor((currentPage-1) / 10);

  const getPages = (totalCount: number) => {
    const totalPage = Math.ceil(totalCount/7);
    const totalGroup = Math.ceil(totalPage / 10);

    return Array.from({ length: totalGroup }, (_, idx) => {
      const isLastGroup = totalGroup-1 === idx;
      return Array.from({ length: !isLastGroup ? 10 : totalPage % 10 || 10 }, (_, i) => (idx * 10) + i+1)
    });
  };

  useEffect(() => {
    setPages(getPages(totalCount));
  }, [totalCount]);

  return (
    <Nav>
      {
        currentPagesIdx > 0 &&
        <PageButton
          onClick={() => goToPage(currentPagesIdx * 10 - 9)}>
          <ArrowLeftIcon fontSize='small' />
        </PageButton>
      }
      {
        pages[currentPagesIdx]?.map((page, idx) => {
          const active = (currentPage - 1) % 10  === idx;

          return (
            <PageButton
              key={page}
              onClick={() => goToPage(page)}
              disabled={active}>
              {page}
            </PageButton>
          );
        })
      }
      {
        currentPagesIdx < pages.length-1 &&
        <PageButton
          onClick={() => goToPage(currentPagesIdx * 10 + 11)}>
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