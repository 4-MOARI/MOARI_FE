import './Pagination.css';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
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

      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;

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