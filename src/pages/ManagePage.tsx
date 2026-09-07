import { useState } from 'react';
import { Link } from 'react-router-dom';
import { weddingData } from '../data/weddingData';
import { parseRsvpReport, rsvpReportCsv, summarizeRsvps, type RsvpReportRow } from '../lib/rsvpReport';
import '../styles/partials/_manage.scss';

export default function ManagePage() {
  const [rows, setRows] = useState<RsvpReportRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [eventId, setEventId] = useState('all');
  const [attendance, setAttendance] = useState('all');
  const summary = summarizeRsvps(rows, weddingData.events.map(event => event.id));
  const filtered = rows.filter(row => row.name.toLocaleLowerCase('vi').includes(search.toLocaleLowerCase('vi'))
    && (eventId === 'all' || (eventId === 'unknown' ? row.attending && !row.eventIds.length : row.eventIds.includes(Number(eventId))))
    && (attendance === 'all' || row.attending === (attendance === 'yes')));
  const exportCsv = () => {
    const csv = rsvpReportCsv(filtered, Object.fromEntries(weddingData.events.map(event => [event.id, event.name])));
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'danh-sach-khach.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <main id="main-content" tabIndex={-1} className="manage-page">
    <Link to="/">← Về thiệp cưới</Link>
    <h1>Danh sách khách mời</h1>
    <p>Mở tệp danh sách xác nhận để lọc khách, tính số người dự từng tiệc và xuất CSV. Nội dung tệp chỉ được xử lý trên thiết bị này.</p>
    <label className="manage-upload">Mở tệp danh sách khách (.json)
      <input type="file" accept=".json,application/json" onChange={async event => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
          if (file.size > 5_000_000) throw new Error('Vui lòng chọn tệp nhỏ hơn 5 MB.');
          setRows(parseRsvpReport(JSON.parse(await file.text()))); setLoaded(true); setError('');
        } catch (cause) { setError(cause instanceof Error ? cause.message : 'Không đọc được tệp.'); }
      }} />
    </label>
    {error && <p role="alert">{error}</p>}
    {loaded && <>
      <div className="manage-stats">
        <p><strong>{summary.confirmations}</strong> xác nhận</p><p><strong>{summary.people}</strong> người tham dự</p>
        <p><strong>{summary.declined}</strong> không tham dự</p>
        {summary.byEvent.map(event => <p key={event.id}><strong>{event.people}</strong> {weddingData.events.find(item => item.id === event.id)?.name}</p>)}
      </div>
      {summary.unassigned > 0 && <p role="status">Có {summary.unassigned} xác nhận chưa chọn tiệc từ form cũ; cần liên hệ để bổ sung. Các bản cũ chưa có mã chung nên cần đối chiếu khách trùng tên trước khi chốt số lượng.</p>}
      <div className="manage-filters">
        <label>Tìm theo tên<input type="search" value={search} onChange={event => setSearch(event.target.value)} /></label>
        <label>Lọc theo tiệc<select value={eventId} onChange={event => setEventId(event.target.value)}><option value="all">Tất cả tiệc</option>
          {weddingData.events.map(event => <option key={event.id} value={event.id}>{event.name}</option>)}<option value="unknown">Chưa chọn tiệc</option></select></label>
        <label>Tham dự<select value={attendance} onChange={event => setAttendance(event.target.value)}><option value="all">Tất cả</option><option value="yes">Có</option><option value="no">Không</option></select></label>
        <button type="button" onClick={exportCsv}>Xuất CSV ({filtered.length})</button>
      </div>
      <div className="manage-table" tabIndex={0} role="region" aria-label="Bảng khách mời">
        <table><thead><tr><th>Họ tên</th><th>Điện thoại</th><th>Tham dự</th><th>Tiệc</th><th>Số người</th><th>Lời nhắn</th></tr></thead>
          <tbody>{filtered.map((row, index) => <tr key={`${row.source}-${row.id}-${index}`}>
            <td>{row.name}</td><td>{row.phone}</td><td>{row.attending ? 'Có' : 'Không'}</td>
            <td>{row.eventIds.map(id => weddingData.events.find(event => event.id === id)?.name).join(', ') || (row.attending ? 'Chưa chọn tiệc' : '—')}</td>
            <td>{row.attending ? row.plusOnes + 1 : 0}</td><td>{row.message}</td>
          </tr>)}</tbody></table>
      </div>
    </>}
  </main>;
}
