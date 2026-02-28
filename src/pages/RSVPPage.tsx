import { useState } from 'react';
import { useWedding } from '../hooks/useWedding';

export default function RSVPPage() {
  const { data, showToast } = useWedding();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    events: [] as string[],
    plusOnes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleEventChange = (event: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      events: checked
        ? [...prev.events, event]
        : prev.events.filter((e) => e !== event),
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập tên';
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^[0-9]{10,11}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call - save to localStorage
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const rsvps = JSON.parse(localStorage.getItem('wedding-rsvps') || '[]');
    rsvps.push({
      ...formData,
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem('wedding-rsvps', JSON.stringify(rsvps));

    setIsSubmitting(false);
    setIsSuccess(true);
    showToast('Xác nhận tham dự thành công!', 'success');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header */}
        <div className="bg-gray-200 rounded-b-lg p-6 text-center">
          <div className="w-32 h-32 mx-auto rounded-full border-4 border-primary overflow-hidden mb-4">
            <img
              src={data.heroSlides[0]}
              alt="Wedding"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
              }}
            />
          </div>
          <h2 className="font-coiny text-2xl uppercase mb-2">Xác nhận tham dự</h2>
          <p className="font-jura text-xl">Đám cưới của</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="font-jura text-xl">{data.groom.shortName}</span>
            <img
              src="/images/heart.gif"
              alt="heart"
              className="w-12 h-12"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50?text=❤️';
              }}
            />
            <span className="font-jura text-xl">{data.bride.shortName}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg max-w-md">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Cảm ơn bạn!</h3>
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn rất nhiều vì sự hiện diện cùng những lời chúc tốt đẹp!
            </p>
            <a
              href="/"
              className="btn-primary inline-block"
            >
              ← Về website đám cưới
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gray-200 rounded-b-lg p-6 text-center">
        <div className="w-32 h-32 mx-auto rounded-full border-4 border-primary overflow-hidden mb-4">
          <img
            src={data.heroSlides[0]}
            alt="Wedding"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
            }}
          />
        </div>
        <h2 className="font-coiny text-2xl uppercase mb-2">Xác nhận tham dự</h2>
        <p className="font-jura text-xl">Đám cưới của</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="font-jura text-xl">{data.groom.shortName}</span>
          <span className="heart-icon"></span>
          <span className="font-jura text-xl">{data.bride.shortName}</span>
        </div>
      </div>

      {/* Form */}
      <main className="max-w-lg mx-auto p-6">
        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="form-group">
            <label className="form-label text-left block">Nhập Tên (*)</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`form-input text-center ${errors.name ? 'border-red-500' : ''}`}
              placeholder="---"
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label text-left block">Nhập số Điện thoại (*)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`form-input text-center ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="---"
            />
            {errors.phone && <p className="form-error">{errors.phone}</p>}
          </div>

          {/* Events */}
          <div className="form-group border rounded-lg p-4 bg-white">
            <p className="font-semibold text-gray-600 mb-3">Chọn sự kiện tham dự</p>
            {data.events.map((event) => (
              <label key={event.id} className="form-checkbox mb-2">
                <input
                  type="checkbox"
                  checked={formData.events.includes(event.name)}
                  onChange={(e) => handleEventChange(event.name, e.target.checked)}
                />
                <span>{event.name}</span>
              </label>
            ))}
          </div>

          {/* Plus Ones */}
          <div className="form-group border rounded-lg p-4 bg-gray-200">
            <p className="font-semibold text-gray-600 mb-3">Bạn đi cùng ai?</p>
            <select
              value={formData.plusOnes}
              onChange={(e) => setFormData({ ...formData, plusOnes: e.target.value })}
              className="form-select py-3"
            >
              <option value="">Bạn có người đi cùng không?</option>
              <option value="0">Đi một mình</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  Đi cùng {num} người
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-jura text-lg py-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
        </form>

        {/* Back link */}
        <div className="text-center mt-6">
          <a href="/" className="text-primary hover:underline inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Về website đám cưới
          </a>
        </div>
      </main>
    </div>
  );
}
