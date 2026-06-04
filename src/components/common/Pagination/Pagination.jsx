import './Pagination.css';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = [1];
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    if (startPage > 2) {
      pages.push('start-ellipsis');
    }

    for (let page = startPage; page <= endPage; page += 1) {
      pages.push(page);
    }

    if (endPage < totalPages - 1) {
      pages.push('end-ellipsis');
    }

    pages.push(totalPages);

    return pages;
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination-container">
      <button
        className="pagination-button"
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        {'<'}
      </button>

      {getVisiblePages().map((page) => {
        if (typeof page === 'string') {
          return (
            <span
              key={page}
              className="pagination-ellipsis"
            >
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            className={
              currentPage === page
                ? 'pagination-button pagination-active'
                : 'pagination-button'
            }
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        );
      })}

      <button
        className="pagination-button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        {'>'}
      </button>
    </div>
  );
}
