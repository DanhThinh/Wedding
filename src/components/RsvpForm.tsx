import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useWedding } from '../hooks/weddingContext';
import {
  createRsvpDraft, persistRsvpDraft, readRsvpDraft, rsvpStorageKey, saveRsvp,
  validateRsvp, RSVP_CHANGED_EVENT, type RsvpDraft, type RsvpErrors, type RsvpSubmission,
} from '../lib/rsvp';
import { getWeddingPhase } from '../lib/weddingState';
import { trackEvent } from '../lib/analytics';

export default function RsvpForm() {
  const { data, guest } = useWedding();
  const key = rsvpStorageKey(guest?.name);
  const id = useId();
  const [initial] = useState(() => {
    try { return { draft: readRsvpDraft(key) ?? createRsvpDraft(guest?.name), error: '' }; }
    catch { return { draft: createRsvpDraft(guest?.name), error: 'Không thể đọc bản nháp trên thiết bị. Vui lòng kiểm tra quyền lưu trữ của trình duyệt.' }; }
  });
  const [draft, setDraft] = useState(initial.draft);
  const draftRef = useRef(draft);
  const [errors, setErrors] = useState<RsvpErrors>({});
  const [storageError, setStorageError] = useState(initial.error);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [deliveryError, setDeliveryError] = useState('');
  const mounted = useRef(true);
  const formRef = useRef<HTMLFormElement>(null);
  const closed = getWeddingPhase(data.weddingDate) === 'after';

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const updateDraft = useCallback((next: RsvpDraft) => {
    draftRef.current = next;
    setDraft(next);
  }, []);

  const deliver = useCallback(async () => {
    if (submittingRef.current || getWeddingPhase(data.weddingDate) === 'after') return;
    const current = draftRef.current;
    const validation = validateRsvp(current.input);
    setErrors(validation);
    if (Object.keys(validation).length) {
      void trackEvent('rsvp_validation_error', { error_count: Object.keys(validation).length });
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    setDeliveryError('');
    try {
      const result = await saveRsvp(current, key);
      if (!mounted.current) return;
      if (draftRef.current.revision === current.revision && !(result.mode === 'pending' && draftRef.current.status === 'sent')) {
        updateDraft({ ...current, status: result.mode === 'firestore' ? 'sent' : 'pending' });
      }
      setStorageError('');
      if (result.mode === 'pending') setDeliveryError(result.reason === 'offline'
        ? 'Bạn đang mất kết nối mạng.'
        : result.reason === 'timeout' ? 'Kết nối đang chậm, chưa nhận được phản hồi từ hệ thống.'
          : 'Hiện chưa thể gửi xác nhận đến chủ tiệc.');
      void trackEvent('rsvp_submit', { mode: result.mode, attending: String(current.input.attending), event_count: current.input.eventIds.length });
    } catch {
      if (mounted.current) setStorageError('Không thể lưu bản nháp trên thiết bị. Thông tin trong form vẫn được giữ lại; vui lòng kiểm tra quyền lưu trữ rồi thử lại.');
    } finally {
      submittingRef.current = false;
      if (mounted.current) setSubmitting(false);
    }
  }, [data.weddingDate, key, updateDraft]);

  useEffect(() => {
    const onDelivered = (event: Event) => {
      const detail = (event as CustomEvent<{ key: string; draft: RsvpDraft }>).detail;
      if (detail.key === key && detail.draft.id === draftRef.current.id && detail.draft.revision === draftRef.current.revision) {
        updateDraft(detail.draft);
        setDeliveryError('');
      }
    };
    const retryPending = () => { if (draftRef.current.status === 'pending') void deliver(); };
    window.addEventListener(RSVP_CHANGED_EVENT, onDelivered);
    window.addEventListener('online', retryPending);
    // Resume only drafts the guest explicitly submitted, not unfinished form edits.
    if (navigator.onLine) retryPending();
    return () => {
      window.removeEventListener(RSVP_CHANGED_EVENT, onDelivered);
      window.removeEventListener('online', retryPending);
    };
  }, [deliver, key, updateDraft]);

  const change = (patch: Partial<RsvpSubmission>) => {
    const next: RsvpDraft = { ...draftRef.current, input: { ...draftRef.current.input, ...patch }, revision: draftRef.current.revision + 1, status: 'draft' };
    updateDraft(next);
    setErrors({});
    setDeliveryError('');
    try { persistRsvpDraft(key, next); setStorageError(''); }
    catch { setStorageError('Chưa lưu được bản nháp trên thiết bị. Vui lòng giữ trang này mở và kiểm tra quyền lưu trữ.'); }
  };

  if (closed) return <div className="rsvp-feedback" role="status"><h3>Phần xác nhận tham dự đã khép lại</h3><p>Cảm ơn bạn đã ghé thăm. Mời bạn xem album kỷ niệm và gửi lời chúc đến chúng mình.</p></div>;

  if (draft.status === 'sent') return (
    <div className="rsvp-feedback" role="status">
      <h3>Cảm ơn bạn!</h3>
      <p>Xác nhận của bạn đã được gửi đến chúng mình.</p>
      <p>{draft.input.attending
        ? `${draft.input.name} · ${draft.input.plusOnes + 1} người · ${data.events.filter(event => draft.input.eventIds.includes(event.id)).map(event => event.name).join(', ')}`
        : `${draft.input.name} · Không thể tham dự`}</p>
      <button type="button" className="invite-btn" onClick={() => change({})}>Chỉnh sửa xác nhận</button>
    </div>
  );

  const { input } = draft;
  const fieldError = (field: keyof RsvpSubmission) => errors[field] && <p id={`${id}-${field}-error`} className="form-error">{errors[field]}</p>;
  const a11y = (field: keyof RsvpSubmission) => ({ 'aria-invalid': Boolean(errors[field]), 'aria-describedby': errors[field] ? `${id}-${field}-error` : undefined });

  return (
    <form ref={formRef} className="shared-rsvp" noValidate onSubmit={event => { event.preventDefault(); void deliver(); }}>
      <fieldset disabled={submitting} className="shared-rsvp__fields">
        <fieldset className="shared-rsvp__choices" {...a11y('attending')} tabIndex={errors.attending ? -1 : undefined}>
          <legend>Bạn có tham dự được không?</legend>
          {[{ value: true, label: 'Tham dự được' }, { value: false, label: 'Không thể tham dự' }].map(choice => (
            <label key={String(choice.value)} className={`shared-rsvp__choice ${input.attending === choice.value ? 'is-active' : ''}`}>
              <input type="radio" name={`${id}-attending`} checked={input.attending === choice.value}
                onChange={() => change({ attending: choice.value, ...(!choice.value ? { eventIds: [], plusOnes: 0 } : {}) })} />
              <span>{choice.label}</span>
            </label>
          ))}
          {fieldError('attending')}
        </fieldset>
        <div className="form-group">
          <label className="form-label" htmlFor={`${id}-name`}>Họ tên *</label>
          <input id={`${id}-name`} className="form-input" autoComplete="name" required maxLength={100}
            value={input.name} onChange={event => change({ name: event.target.value })} {...a11y('name')} />
          {fieldError('name')}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor={`${id}-phone`}>Số điện thoại (không bắt buộc)</label>
          <input id={`${id}-phone`} className="form-input" type="tel" autoComplete="tel" maxLength={24}
            value={input.phone} onChange={event => change({ phone: event.target.value })} {...a11y('phone')} />
          {fieldError('phone')}
        </div>
        {input.attending && <>
          <fieldset className="shared-rsvp__events" {...a11y('eventIds')} tabIndex={errors.eventIds ? -1 : undefined}>
            <legend>Bạn sẽ tham dự tiệc nào? *</legend>
            {data.events.map(event => <label key={event.id} className="shared-rsvp__event">
              <input type="checkbox" checked={input.eventIds.includes(event.id)} onChange={e => change({
                eventIds: e.target.checked ? [...input.eventIds, event.id] : input.eventIds.filter(id => id !== event.id),
              })} />
              <span><strong>{event.name}</strong><small>{event.date?.split('-').reverse().join('/')} · {event.timeDisplay} · {event.location}</small></span>
            </label>)}
            {fieldError('eventIds')}
          </fieldset>
          <div className="form-group">
            <label className="form-label" htmlFor={`${id}-plusOnes`}>Số người đi cùng</label>
            <select id={`${id}-plusOnes`} className="form-select" value={input.plusOnes} onChange={e => change({ plusOnes: Number(e.target.value) })} {...a11y('plusOnes')}>
              <option value={0}>Đi một mình</option>
              {Array.from({ length: 10 }, (_, i) => i + 1).map(number => <option key={number} value={number}>Đi cùng {number} người</option>)}
            </select>
            {fieldError('plusOnes')}
          </div>
        </>}
        <div className="form-group">
          <label className="form-label" htmlFor={`${id}-message`}>Lời nhắn</label>
          <textarea id={`${id}-message`} className="form-textarea" rows={3} maxLength={500} value={input.message}
            onChange={event => change({ message: event.target.value })} {...a11y('message')} />
          {fieldError('message')}
        </div>
      </fieldset>
      {storageError && <p className="form-error" role="alert">{storageError}</p>}
      {draft.status === 'pending' && <div className="rsvp-pending" role="status">
        <strong>Chưa xác nhận được chủ tiệc đã nhận thông tin.</strong>
        <p>{deliveryError} Bản nháp đã được giữ trên thiết bị này. Bạn có thể gửi lại, hoặc xác nhận trực tiếp với cô dâu/chú rể nếu cần gấp.</p>
      </div>}
      <button type="submit" className="invite-btn shared-rsvp__submit" disabled={submitting}>
        {submitting ? 'Đang gửi...' : draft.status === 'pending' ? 'Gửi lại xác nhận' : 'Xác nhận tham dự'}
      </button>
      <p className="shared-rsvp__privacy">Thông tin xác nhận chỉ dành cho chủ tiệc. Bạn có thể quay lại trên thiết bị này để chỉnh sửa.</p>
    </form>
  );
}
