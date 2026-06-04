import './Pagination.css';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  const getVisiblePages = () => {
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const halfRange = Math.floor(maxVisiblePages / 2);
    let startPage = currentPage - halfRange;
    let endPage = currentPage + halfRange;

    if (startPage < 1) {
      startPage = 1;
      endPage = maxVisiblePages;
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = totalPages - maxVisiblePages + 1;
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
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

      {getVisiblePages().map((page) => (
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
      ))}

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
