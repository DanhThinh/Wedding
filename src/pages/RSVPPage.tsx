import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWedding } from '../hooks/weddingContext';
import { setImageFallback } from '../lib/imageFallback';
import { normalizePhone, saveRsvp, validateRsvp, type RsvpSaveMode } from '../lib/rsvp';
import { getWeddingPhase } from '../lib/weddingState';
import { trackEvent } from '../lib/analytics';

export default function RSVPPage() {
  const { data, showToast, guest } = useWedding();
  const [formData, setFormData] = useState({
    // Điền sẵn khi mở từ link cá nhân hoá (`?guest=`).
    name: guest?.name ?? '',
    phone: '',
    eventIds: [] as number[],
    plusOnes: '0',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMode, setSaveMode] = useState<RsvpSaveMode | null>(null);
  const phase = getWeddingPhase(data.weddingDate);

  const handleEventChange = (eventId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      eventIds: checked
        ? [...prev.eventIds, eventId]
        : prev.eventIds.filter((id) => id !== eventId),
    }));
  };

  const validate = () => {
    const newErrors = validateRsvp({
      name: formData.name,
      phone: normalizePhone(formData.phone),
      eventIds: formData.eventIds,
      plusOnes: Number(formData.plusOnes),
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      void trackEvent('rsvp_validation_error', {
        error_count: Object.keys(validateRsvp({
          name: formData.name,
          phone: normalizePhone(formData.phone),
          eventIds: formData.eventIds,
          plusOnes: Number(formData.plusOnes),
        })).length,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const plusOnes = Number(formData.plusOnes);
      const mode = await saveRsvp({
        name: formData.name.trim(),
        phone: normalizePhone(formData.phone),
        eventIds: formData.eventIds,
        plusOnes,
      });
      void trackEvent('rsvp_submit', {
        mode,
        event_count: formData.eventIds.length,
        plus_ones_count: plusOnes,
      });
      setSaveMode(mode);
      showToast(
        mode === 'firestore'
          ? 'Xác nhận tham dự thành công!'
          : 'Đã lưu xác nhận trên thiết bị này.',
        mode === 'firestore' ? 'success' : 'info',
      );
    } catch {
      showToast('Không thể lưu xác nhận, thử lại nhé!', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const header = (
    <header className="rsvp-hero">
      <div className="rsvp-hero-media" aria-hidden="true">
        <img
          src={data.heroSlides[0]}
          alt=""
          onError={(e) => setImageFallback(e.currentTarget)}
        />
      </div>
      <div className="rsvp-hero-overlay" aria-hidden="true" />
      <div className="rsvp-hero-content">
        <Link to="/" className="rsvp-back-link" data-reveal="up">
          <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Về thiệp cưới
        </Link>
        <p className="rsvp-eyebrow" data-reveal="up">{phase === 'after' ? 'Wedding Memories' : 'Wedding RSVP'}</p>
        <h1 className="rsvp-title" data-reveal="up">{phase === 'after' ? 'Ngày vui đã diễn ra' : 'Xác nhận tham dự'}</h1>
        <p className="rsvp-couple" data-reveal="up">
          {data.groom.shortName}
          <span>&amp;</span>
          {data.bride.shortName}
        </p>
        <p className="rsvp-date" data-reveal="up">{data.weddingDateDisplay}</p>
      </div>
    </header>
  );

  if (phase === 'after') {
    return (
      <div className="rsvp-page">
        {header}
        <main className="rsvp-main">
          <section className="rsvp-card rsvp-success-card" data-reveal="scale">
            <h2>Cảm ơn bạn đã ghé thăm</h2>
            <p>Phần xác nhận tham dự đã khép lại. Mời bạn trở về xem những kỷ niệm và gửi lời chúc đến chúng mình.</p>
            <Link to="/#album" className="btn-primary"><span>Xem album kỷ niệm</span></Link>
          </section>
        </main>
      </div>
    );
  }

  if (saveMode) {
    return (
      <div className="rsvp-page">
        {header}
        <main className="rsvp-main">
          <section className="rsvp-card rsvp-success-card" data-reveal="scale" aria-live="polite">
            <div className="rsvp-success-icon">
              <svg width="34" height="34" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2>Cảm ơn bạn!</h2>
            <p>
              {saveMode === 'firestore'
                ? 'Xác nhận của bạn đã được gửi đến chúng mình. Sự hiện diện của bạn là niềm vui lớn với chúng mình.'
                : 'Xác nhận đang được lưu trên thiết bị này vì hệ thống trực tuyến chưa được cấu hình. Vui lòng liên hệ trực tiếp với cô dâu hoặc chú rể.'}
            </p>
            <Link to="/" className="btn-primary">
              <span>Về website đám cưới</span>
            </Link>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="rsvp-page">
      {header}

      <main className="rsvp-main">
        <form className="rsvp-card" data-reveal="up" data-pointer-fx="glow" onSubmit={handleSubmit} noValidate>
          <div className="rsvp-form-head">
            <p className="section-eyebrow">Guest Confirmation</p>
            <h2>Thông tin tham dự</h2>
            <p>Vui lòng để lại thông tin để chúng mình chuẩn bị đón tiếp chu đáo.</p>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="rsvp-name">Tên của bạn *</label>
            <input
              id="rsvp-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`form-input ${errors.name ? 'input-error' : ''}`}
              placeholder="Ví dụ: Nguyễn Văn An"
              autoComplete="name"
              maxLength={100}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'rsvp-name-error' : undefined}
              required
            />
            {errors.name && <p id="rsvp-name-error" className="form-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="rsvp-phone">Số điện thoại *</label>
            <input
              id="rsvp-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`form-input ${errors.phone ? 'input-error' : ''}`}
              placeholder="Ví dụ: 0912345678"
              autoComplete="tel"
              inputMode="tel"
              maxLength={18}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'rsvp-phone-error' : undefined}
              required
            />
            {errors.phone && <p id="rsvp-phone-error" className="form-error">{errors.phone}</p>}
          </div>

          <fieldset className="rsvp-fieldset">
            <legend>Chọn sự kiện tham dự *</legend>
            <div className="rsvp-event-options">
              {data.events.map((event) => (
                <label key={event.id} className="rsvp-event-option">
                  <input
                    type="checkbox"
                    checked={formData.eventIds.includes(event.id)}
                    onChange={(e) => handleEventChange(event.id, e.target.checked)}
                  />
                  <span>
                    <strong>{event.name}</strong>
                    <small>{event.timeDisplay} · {event.location}</small>
                  </span>
                </label>
              ))}
            </div>
            {errors.events && <p className="form-error" role="alert">{errors.events}</p>}
          </fieldset>

          <div className="form-group">
            <label className="form-label" htmlFor="rsvp-plus-ones">Số người đi cùng</label>
            <select
              id="rsvp-plus-ones"
              value={formData.plusOnes}
              onChange={(e) => setFormData({ ...formData, plusOnes: e.target.value })}
              className="form-select"
            >
              <option value="0">Đi một mình</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  Đi cùng {num} người
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary rsvp-submit-btn"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Đang xử lý...</span>
              </>
            ) : (
              <span>Xác nhận tham dự</span>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
