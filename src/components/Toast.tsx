import { useWedding } from '../hooks/useWedding';

export default function Toast() {
  const { toast } = useWedding();

  return (
    <div className={`toast ${toast.type} ${toast.show ? 'show' : ''}`}>
      {toast.type === 'success' && (
        <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {toast.type === 'error' && (
        <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {toast.message}
    </div>
  );
}
