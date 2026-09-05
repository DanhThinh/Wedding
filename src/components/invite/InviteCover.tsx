import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { inviteData } from '../../data/inviteData';
import { useWedding } from '../../hooks/weddingContext';
import { FloralBand, WaxSeal } from './art';

interface InviteCoverProps {
  onOpen: () => void;
}

/**
 * Bìa thiệp: nền giấy sáng, hai nhánh hoa ly hai bên, con dấu sáp ở giữa.
 * Chạm vào bất kỳ đâu → dấu sáp bật ra, bìa tách đôi theo chiều dọc để lộ thiệp.
 */
export default function InviteCover({ onOpen }: InviteCoverProps) {
  const { guest } = useWedding();
  const [isHidden, setIsHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const leafLeftRef = useRef<HTMLDivElement>(null);
  const leafRightRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const isOpening = useRef(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.fromTo(
        '.cover-fade',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' },
      );
      gsap.to(sealRef.current, {
        scale: 1.06,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, rootRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const open = () => {
    if (isOpening.current) return;
    isOpening.current = true;

    const finish = () => {
      setIsHidden(true);
      onOpen();
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }

    gsap.killTweensOf(sealRef.current);
    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: finish });

    tl.to(sealRef.current, { scale: 0.84, duration: 0.14, ease: 'power2.in' })
      .to(sealRef.current, { scale: 1.6, opacity: 0, filter: 'blur(6px)', duration: 0.45, ease: 'power3.out' })
      .to('.cover-fade', { opacity: 0, duration: 0.35 }, '-=0.32')
      .to(leafLeftRef.current, { xPercent: -102, duration: 1.05 }, '-=0.18')
      .to(leafRightRef.current, { xPercent: 102, duration: 1.05 }, '<')
      .to(rootRef.current, { autoAlpha: 0, duration: 0.3 }, '-=0.25');
  };

  if (isHidden) return null;

  return (
    <div ref={rootRef} className="invite-cover">
      <button type="button" className="invite-cover__hit" onClick={open} aria-label="Mở thiệp cưới" />

      {/* Hai nửa bìa vẽ cùng một dải hoa full-width nên nét hoa khớp liền nhau */}
      <div ref={leafLeftRef} className="invite-cover__leaf invite-cover__leaf--left" aria-hidden="true">
        <div className="invite-cover__leaf-inner">
          <FloralBand className="invite-cover__flower" />
        </div>
      </div>

      <div ref={leafRightRef} className="invite-cover__leaf invite-cover__leaf--right" aria-hidden="true">
        <div className="invite-cover__leaf-inner">
          <FloralBand className="invite-cover__flower" />
        </div>
      </div>

      {/* Chỉ hiện khi mở bằng link cá nhân hoá (`?guest=`) */}
      {guest && (
        <div className="invite-cover__greeting cover-fade">
          <p className="invite-cover__greeting-eyebrow">Trân trọng kính mời</p>
          <p className="invite-cover__greeting-name">{guest.label}</p>
        </div>
      )}

      <div className="invite-cover__seal" aria-hidden="true">
        <div ref={sealRef} className="invite-cover__seal-inner cover-fade">
          <WaxSeal className="invite-cover__seal-svg" />
        </div>
      </div>

      <p className="invite-cover__hint cover-fade">{inviteData.cover.hint}</p>
    </div>
  );
}
