import { useState } from 'react';
import Pagination from '../../components/common/Pagination/Pagination';

export default function SearchPage() {
    //디폹로 처음 들어가면 1페이지
  const [currentPage, setCurrentPage] = useState(1);
//임시로 5로 설정(나중에흠 currentPage, totalPages로관리해서 paginationdp props로 넘겨주면 됩니다)
  const totalPages = 5;

  return (
    <div>
      {/* 검색 결과 카드 목록 */}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}