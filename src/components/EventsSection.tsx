import { useState, useRef, useEffect } from 'react';
import { useWedding } from '../hooks/weddingContext';
import { createGoogleCalendarUrl, downloadIcs } from '../lib/calendar';
import { trackEvent } from '../lib/analytics';
import { getVenueMapQuery, hasMappableAddress } from '../lib/venue';
import RevealTitle from './RevealTitle';

const CalendarIcons = {
  google: (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  ),
  apple: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.79 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  ),
  outlook: (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path fill="#0078D4" d="M24 7.387v10.478c0 .23-.08.424-.238.576-.159.154-.361.23-.608.23h-8.539v-6.133l1.33 1.12c.097.08.208.12.332.12s.235-.04.332-.12L24 7.307v.08zm-.846-.63L15.95 12.76l-1.335-1.08V5.328h8.293c.247 0 .449.077.608.23.158.153.238.346.238.576v.623zm-11.385 7.578h-1.42V8.383c0-.263-.091-.48-.274-.655-.183-.173-.42-.26-.71-.26H2.618c-.29 0-.527.087-.71.26-.183.175-.274.392-.274.655v5.952H.213V8.383c0-.685.239-1.263.716-1.734.478-.472 1.065-.707 1.763-.707h6.746c.698 0 1.285.235 1.763.707.478.47.716 1.049.716 1.734v5.952zm-2.152 4.43H1.93V14.6h7.687v4.165zm0-4.885H1.93V9.103h7.687v4.776z"/>
    </svg>
  ),
};

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export default function EventsSection() {
  const { data } = useWedding();
  const [activePopover, setActivePopover] = useState<number | null>(null);
  const [expandedMap, setExpandedMap] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getMapEmbedUrl = (address: string) => {
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  // Chỉ đường (Navigation mode)
  const getDirectionsUrl = (address: string) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  };

  const handleMapToggle = (eventId: number) => {
    const nextExpandedMap = expandedMap === eventId ? null : eventId;
    setExpandedMap(nextExpandedMap);
    void trackEvent('map_toggle', {
      event_id: eventId,
      expanded: nextExpandedMap === eventId,
    });
  };

  const handleCalendarPopover = (eventId: number) => {
    const nextActivePopover = activePopover === eventId ? null : eventId;
    setActivePopover(nextActivePopover);
    if (nextActivePopover === eventId) {
      void trackEvent('calendar_menu_open', {
        event_id: eventId,
      });
    }
  };

  const handleIcsDownload = (eventId: number, method: 'apple' | 'outlook') => {
    const event = data.events.find(item => item.id === eventId);
    if (!event) return;
    void trackEvent('calendar_add', {
      event_id: eventId,
      method,
    });
    downloadIcs(event);
  };

  return (
    <section id="events" className="py-24 section-white events-section">
      <div className="container-custom">

        <div className="text-center mb-12">
          <span className="section-eyebrow" data-reveal="up">Wedding Schedule</span>
          <RevealTitle text="Sự Kiện Cưới" className="section-title" />
          <p className="section-subtitle" data-reveal="up">
            Hân hạnh được đón tiếp quý khách
          </p>
        </div>

        <div className="events-grid">
          {data.events.map((event) => {
            const canShowMap = hasMappableAddress(event.address);
            const mapQuery = getVenueMapQuery(event);

            return (
              <div
                key={event.id}
                className="event-card"
                data-reveal="scale"
              >
              <div className="event-icon-wrap">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ color: 'var(--primary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <h3 className="event-name">{event.name}</h3>
              <p className="event-time">{event.timeDisplay}</p>
              <p className="event-location">{event.location}</p>
              <p className="event-address">{event.address}</p>

              <div className="event-actions">
                {canShowMap ? (
                  <>
                    {/* Toggle map embed */}
                    <button
                      onClick={() => handleMapToggle(event.id)}
                      className="event-map-btn"
                      aria-label={expandedMap === event.id ? 'Ẩn bản đồ' : 'Xem bản đồ'}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="10" r="3" strokeLinecap="round"/>
                      </svg>
                      {expandedMap === event.id ? 'Ẩn' : 'Bản đồ'}
                    </button>

                    {/* Chỉ đường */}
                    <a
                      href={getDirectionsUrl(mapQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="event-map-btn"
                      aria-label={`Chỉ đường đến ${event.name}`}
                      onClick={() => {
                        void trackEvent('map_directions_open', {
                          event_id: event.id,
                        });
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M9 11l3 3L22 4M3 20l3.09-6.18a3 3 0 012.71-1.82h0a3 3 0 012.71 1.82L15 20" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 20h12" strokeLinecap="round"/>
                      </svg>
                      Chỉ đường
                    </a>
                  </>
                ) : (
                  <button type="button" className="event-map-btn" disabled>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="10" r="3" strokeLinecap="round"/>
                    </svg>
                    Bản đồ sẽ cập nhật
                  </button>
                )}

                {/* Add to calendar */}
                <div className="relative" ref={activePopover === event.id ? popoverRef : undefined}>
                  <button
                    onClick={() => handleCalendarPopover(event.id)}
                    className="event-map-btn"
                    aria-expanded={activePopover === event.id}
                    aria-haspopup="true"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Lịch
                  </button>

                  {activePopover === event.id && (
                    <div className="calendar-popover">
                      <a
                        href={createGoogleCalendarUrl(event)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="calendar-popover-item"
                        onClick={() => {
                          void trackEvent('calendar_add', {
                            event_id: event.id,
                            method: 'google',
                          });
                        }}
                      >
                        {CalendarIcons.google}
                        <span>Google Calendar</span>
                      </a>
                      <button onClick={() => handleIcsDownload(event.id, 'apple')} className="calendar-popover-item w-full">
                        {CalendarIcons.apple}
                        <span>Apple Calendar</span>
                      </button>
                      <button onClick={() => handleIcsDownload(event.id, 'outlook')} className="calendar-popover-item w-full">
                        {CalendarIcons.outlook}
                        <span>Outlook / ICS</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Embedded Google Map (collapsible) */}
              {canShowMap && expandedMap === event.id && (
                <div className="event-map-embed">
                  <iframe
                    title={`Bản đồ ${event.name}`}
                    width="100%"
                    height="280"
                    style={{ border: 0, borderRadius: 'var(--r-md)' }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer"
                    src={getMapEmbedUrl(mapQuery)}
                  />
                  <div className="event-map-footer">
                    <a
                      href={mapsUrl(mapQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="event-map-link"
                      onClick={() => {
                        void trackEvent('map_directions_open', {
                          event_id: event.id,
                          source: 'embed_footer',
                        });
                      }}
                    >
                      Mở trong Google Maps →
                    </a>
                  </div>
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
