import './RecruitStatusBadge.css';

export default function RecruitStatusBadge({ status }) {
  return (
    <div className={`recruit-badge ${status === '모집중' ? 'recruiting' : 'closed'}`}>
      {status}
    </div>
  );
}