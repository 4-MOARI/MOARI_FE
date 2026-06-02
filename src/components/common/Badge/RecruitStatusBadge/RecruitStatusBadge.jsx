//동아리 카드나 정지된 카드에 들어감(동아리 등록/수정 페이지 모집상태배지랑 다름!)
import './RecruitStatusBadge.css';

export default function RecruitStatusBadge({ status }) {
  return (
    <div className={`recruit-badge ${status === '모집중' ? 'recruiting' : 'closed'}`}>
      {status}
    </div>
  );
}