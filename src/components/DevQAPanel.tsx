/**
 * DevQAPanel – Toggle with Ctrl + Shift + D
 * Shows viewport info, grid overlay, overflow highlight and runs layout checks.
 */
import { useState, useEffect, useCallback } from 'react';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  detail: string;
}

function getBreakpointName(w: number): string {
  if (w < 360) return '<xs (360)';
  if (w < 480) return 'xs (360–480)';
  if (w < 768) return 'sm (480–768)';
  if (w < 1024) return 'md (768–1024)';
  if (w < 1280) return 'lg (1024–1280)';
  if (w < 1440) return 'xl (1280–1440)';
  if (w < 1920) return '2xl (1440–1920)';
  return '3xl (1920+)';
}

function runLayoutChecks(): CheckResult[] {
  const results: CheckResult[] = [];

  // 1. Horizontal overflow
  const hasHOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;
  results.push({
    name: 'No horizontal overflow',
    status: hasHOverflow ? 'fail' : 'pass',
    detail: hasHOverflow
      ? `scrollWidth ${document.documentElement.scrollWidth}px > clientWidth ${document.documentElement.clientWidth}px`
      : 'OK – no horizontal scroll',
  });

  // 2. Body font size >= 14px
  const bodySize = parseFloat(window.getComputedStyle(document.body).fontSize);
  results.push({
    name: 'Body font ≥ 14px',
    status: bodySize >= 14 ? 'pass' : 'fail',
    detail: `body font-size = ${bodySize.toFixed(1)}px`,
  });

  // 3. Tap targets ≥ 44px (interactive elements)
  const interactives = Array.from(
    document.querySelectorAll<HTMLElement>('button, a, input, select, textarea, [role="button"]')
  );
  const smallTargets = interactives.filter((el) => {
    const r = el.getBoundingClientRect();
    return (r.width < 44 || r.height < 44) && r.width > 0;
  });
  results.push({
    name: 'Tap targets ≥ 44px',
    status: smallTargets.length === 0 ? 'pass' : smallTargets.length <= 3 ? 'warn' : 'fail',
    detail:
      smallTargets.length === 0
        ? `All ${interactives.length} interactive elements OK`
        : `${smallTargets.length} element(s) smaller than 44px (e.g. ${smallTargets[0]?.tagName?.toLowerCase()})`,
  });

  // 4. Images have width/height or aspect-ratio (CLS risk)
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('img'));
  const clsRisk = imgs.filter(
    (img) =>
      (!img.hasAttribute('width') || !img.hasAttribute('height')) &&
      !img.style.aspectRatio &&
      !img.closest('[class*="aspect-"]')
  );
  results.push({
    name: 'Images CLS-safe (w/h or aspect-ratio)',
    status: clsRisk.length === 0 ? 'pass' : clsRisk.length <= 3 ? 'warn' : 'fail',
    detail:
      clsRisk.length === 0
        ? `All ${imgs.length} images have dimensions`
        : `${clsRisk.length}/${imgs.length} image(s) missing explicit dimensions`,
  });

  // 5. All images have alt text
  const missingAlt = imgs.filter((img) => !img.hasAttribute('alt'));
  results.push({
    name: 'Images have alt text',
    status: missingAlt.length === 0 ? 'pass' : 'warn',
    detail:
      missingAlt.length === 0
        ? `All ${imgs.length} images have alt`
        : `${missingAlt.length} image(s) missing alt attribute`,
  });

  // 6. Headings hierarchy (no h1 skipping)
  const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'));
  const h1Count = headings.filter((h) => h.tagName === 'H1').length;
  results.push({
    name: 'Single H1 on page',
    status: h1Count === 1 ? 'pass' : h1Count === 0 ? 'fail' : 'warn',
    detail: `Found ${h1Count} <h1> element(s)`,
  });

  return results;
}

const GRID_STYLE = `
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 99990;
  background-image:
    linear-gradient(rgba(255,0,100,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,0,100,0.06) 1px, transparent 1px);
  background-size: 8px 8px;
`;

export default function DevQAPanel() {
  const [open, setOpen] = useState(false);
  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [gridVisible, setGridVisible] = useState(false);
  const [overflowHighlight, setOverflowHighlight] = useState(false);
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [checksRun, setChecksRun] = useState(false);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Viewport resize
  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Grid overlay element
  useEffect(() => {
    let grid = document.getElementById('qa-grid-overlay');
    if (gridVisible) {
      if (!grid) {
        grid = document.createElement('div');
        grid.id = 'qa-grid-overlay';
        grid.style.cssText = GRID_STYLE;
        document.body.appendChild(grid);
      }
    } else {
      grid?.remove();
    }
    return () => document.getElementById('qa-grid-overlay')?.remove();
  }, [gridVisible]);

  // Overflow highlight
  useEffect(() => {
    const styleId = 'qa-overflow-style';
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (overflowHighlight) {
      if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        style.textContent = `* { outline: 1px solid rgba(255,0,0,0.25) !important; } *:hover { outline: 2px solid rgba(255,0,0,0.7) !important; }`;
        document.head.appendChild(style);
      }
    } else {
      style?.remove();
    }
    return () => document.getElementById(styleId)?.remove();
  }, [overflowHighlight]);

  const handleRunChecks = useCallback(() => {
    setChecks(runLayoutChecks());
    setChecksRun(true);
  }, []);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 99995,
          background: 'rgba(45,36,34,0.85)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
          opacity: 0.6,
          transition: 'opacity 0.2s',
        }}
        title="Dev QA Panel (Ctrl+Shift+D)"
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
        aria-label="Open Dev QA Panel"
      >
        🔬
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 99995,
        width: 'min(360px, calc(100vw - 32px))',
        maxHeight: '80vh',
        overflowY: 'auto',
        background: 'rgba(18,18,20,0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        color: '#f0f0f0',
        fontFamily: '"Inter", "SF Mono", monospace',
        fontSize: '12px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}
      role="dialog"
      aria-label="Dev QA Panel"
    >
      {/* Header */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '0.5px' }}>🔬 Dev QA Panel</span>
        <button
          onClick={() => setOpen(false)}
          style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '16px', padding: '2px 6px', borderRadius: '4px' }}
          aria-label="Close"
        >×</button>
      </div>

      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Viewport Info */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px 12px' }}>
          <div style={{ color: '#888', marginBottom: '6px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Viewport</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
            <Row label="Size" value={`${viewport.w} × ${viewport.h}px`} />
            <Row label="DPR" value={`${window.devicePixelRatio}`} />
            <Row label="BP" value={getBreakpointName(viewport.w)} />
            <Row label="Orient" value={viewport.w >= viewport.h ? 'Landscape' : 'Portrait'} />
          </div>
        </div>

        {/* Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Toggle
            label="Grid Overlay (8px baseline)"
            active={gridVisible}
            onToggle={() => setGridVisible((v) => !v)}
          />
          <Toggle
            label="Highlight All Elements"
            active={overflowHighlight}
            onToggle={() => setOverflowHighlight((v) => !v)}
          />
        </div>

        {/* Run Checks Button */}
        <button
          onClick={handleRunChecks}
          style={{
            padding: '8px 12px',
            background: '#ee8584',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '12px',
            letterSpacing: '0.5px',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#9f5958')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#ee8584')}
        >
          ▶ Run Layout Checks
        </button>

        {/* Check Results */}
        {checksRun && (
          <div>
            <div style={{ color: '#888', marginBottom: '6px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Results ({checks.filter(c => c.status === 'pass').length}/{checks.length} passed)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {checks.map((c, i) => (
                <div
                  key={i}
                  style={{
                    background: c.status === 'pass' ? 'rgba(56,161,105,0.12)' : c.status === 'warn' ? 'rgba(214,158,46,0.12)' : 'rgba(229,62,62,0.12)',
                    border: `1px solid ${c.status === 'pass' ? 'rgba(56,161,105,0.3)' : c.status === 'warn' ? 'rgba(214,158,46,0.3)' : 'rgba(229,62,62,0.3)'}`,
                    borderRadius: '6px',
                    padding: '6px 10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span>{c.status === 'pass' ? '✅' : c.status === 'warn' ? '⚠️' : '❌'}</span>
                    <span style={{ fontWeight: 600, fontSize: '11px' }}>{c.name}</span>
                  </div>
                  <div style={{ color: '#999', fontSize: '10px', paddingLeft: '20px' }}>{c.detail}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ color: '#555', fontSize: '10px', textAlign: 'center' }}>
          Ctrl+Shift+D to toggle
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span style={{ color: '#888' }}>{label}</span>
      <span style={{ color: '#e0e0e0', fontWeight: 500 }}>{value}</span>
    </>
  );
}

function Toggle({ label, active, onToggle }: { label: string; active: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 10px',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '6px',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      role="switch"
      aria-checked={active}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onToggle()}
    >
      <span style={{ fontSize: '11px', color: active ? '#f0f0f0' : '#999' }}>{label}</span>
      <div
        style={{
          width: '32px',
          height: '18px',
          borderRadius: '9px',
          background: active ? '#ee8584' : '#333',
          position: 'relative',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '2px',
            left: active ? '16px' : '2px',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: 'white',
            transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}
        />
      </div>
    </div>
  );
}
