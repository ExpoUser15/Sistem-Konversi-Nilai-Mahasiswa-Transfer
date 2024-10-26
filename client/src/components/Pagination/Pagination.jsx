import React, { useState } from 'react';
import RcPagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';

const locale = {
  prev_page: 'Previous',
  next_page: 'Next',
  jump_to: 'Go to',
  jump_to_confirm: 'Confirm',
  page: 'Page',
  items_per_page: 'items/page',
};

const data = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `Item ${index + 1}`,
}));

const ITEMS_PER_PAGE = 10;

const Pagination = ({ children, data }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { currentData })
      )}
      <RcPagination
        current={currentPage}
        total={data.length}
        pageSize={ITEMS_PER_PAGE}
        onChange={handlePageChange}
        showQuickJumper
        locale={locale} 
      />
    </>
  );
};
export default Pagination;