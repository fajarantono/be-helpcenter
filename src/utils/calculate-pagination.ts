import { IPaginationInfo } from './types/pagination-info.type';

export const calculatePagination = (
  totalData: number,
  currentPage: number,
  limitPerPage: number,
): IPaginationInfo => {
  const totalPages = Math.ceil(totalData / limitPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const nextPage = hasNextPage ? currentPage + 1 : null;
  const prevPage = hasPrevPage ? currentPage - 1 : null;

  return {
    total: totalData,
    page: currentPage,
    prev: prevPage,
    next: nextPage,
  };
};
