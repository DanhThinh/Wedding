import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';

class SectionBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <p role="status">Chưa tải được album. <button type="button" onClick={() => window.location.reload()}>Tải lại trang</button></p>;
    return this.props.children;
  }
}

/** Render the lazy child only near the viewport, not during the first page render. */
export default function DeferredSection({ children, id }: { children: ReactNode; id: string }) {
  const marker = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => !('IntersectionObserver' in window));
  useEffect(() => {
    const node = marker.current;
    if (!node) return;
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: '500px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={marker} id={visible ? undefined : id} style={{ minHeight: visible ? undefined : 320 }}>
    {visible ? <SectionBoundary><Suspense fallback={<p role="status">Đang tải album…</p>}>{children}</Suspense></SectionBoundary>
      : <button type="button" className="invite-btn" onClick={() => setVisible(true)}>Xem album ảnh cưới</button>}
  </div>;
}
