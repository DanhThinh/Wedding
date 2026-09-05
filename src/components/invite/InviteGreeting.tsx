import { useWedding } from '../../hooks/weddingContext';

/**
 * Dòng mời riêng nằm giữa Save The Date và Our Love Story.
 * Không render gì khi thiệp được mở bằng link dùng chung.
 */
export default function InviteGreeting() {
  const { guest } = useWedding();
  if (!guest) return null;

  return (
    <section className="invite-greeting" aria-label="Lời mời riêng">
      <p className="invite-greeting__eyebrow" data-reveal="fade">Thân mời</p>
      <p className="invite-greeting__name" data-reveal="up">{guest.label}</p>
      <span className="invite-greeting__rule" aria-hidden="true" />
    </section>
  );
}
