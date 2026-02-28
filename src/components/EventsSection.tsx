import { useState, useRef, useEffect } from 'react';
import { useWedding } from '../hooks/useWedding';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Calendar icons as inline SVGs
const CalendarIcons = {
  google: (
    <svg viewBox="0 0 24 24" className="w-6 h-6">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  ),
  apple: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.79 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  ),
  outlook: (
    <svg viewBox="0 0 24 24" className="w-6 h-6">
      <path fill="#0078D4" d="M24 7.387v10.478c0 .23-.08.424-.238.576-.159.154-.361.23-.608.23h-8.539v-6.133l1.33 1.12c.097.08.208.12.332.12s.235-.04.332-.12L24 7.307v.08zm-.846-.63L15.95 12.76l-1.335-1.08V5.328h8.293c.247 0 .449.077.608.23.158.153.238.346.238.576v.623zm-11.385 7.578h-1.42V8.383c0-.263-.091-.48-.274-.655-.183-.173-.42-.26-.71-.26H2.618c-.29 0-.527.087-.71.26-.183.175-.274.392-.274.655v5.952H.213V8.383c0-.685.239-1.263.716-1.734.478-.472 1.065-.707 1.763-.707h6.746c.698 0 1.285.235 1.763.707.478.47.716 1.049.716 1.734v5.952zm-2.152 4.43H1.93V14.6h7.687v4.165zm0-4.885H1.93V9.103h7.687v4.776z"/>
    </svg>
  ),
  microsoft365: (
    <svg viewBox="0 0 24 24" className="w-6 h-6">
      <path fill="#F25022" d="M1 1h10v10H1z"/>
      <path fill="#00A4EF" d="M1 13h10v10H1z"/>
      <path fill="#7FBA00" d="M13 1h10v10H13z"/>
      <path fill="#FFB900" d="M13 13h10v10H13z"/>
    </svg>
  ),
};

function generateICS(event: any) {
  const formatDate = (date: string, time: string) => {
    const d = new Date(`${date}T${time}:00`);
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const start = formatDate(event.date, event.time);
  const endDate = new Date(`${event.date}T${event.time}:00`);
  endDate.setHours(endDate.getHours() + 2);
  const end = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding//EN
BEGIN:VEVENT
UID:${Date.now()}@wedding
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${start}
DTEND:${end}
SUMMARY:${event.name}
LOCATION:${event.address}
DESCRIPTION:${event.description}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.name.replace(/\s+/g, '-')}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

function generateGoogleCalendarUrl(event: any) {
  const start = `${event.date.replace(/-/g, '')}T${event.time.replace(':', '')}00`;
  const endDate = new Date(`${event.date}T${event.time}:00`);
  endDate.setHours(endDate.getHours() + 2);
  const end = endDate.toISOString().replace(/[-:]/g, '').split('.')[0].replace('T', 'T');
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${start}/${end.slice(0, 15)}&location=${encodeURIComponent(event.address)}&details=${encodeURIComponent(event.description)}`;
}

export default function EventsSection() {
  const { data } = useWedding();
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.1 });
  const [activePopover, setActivePopover] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setActivePopover(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section id="events" ref={ref} className="py-20 bg-gray-50">
      <div className="container-custom">
        <h2 className="section-title">Sự Kiện Cưới</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {data.events.map((event, index) => (
            <div
              key={event.id}
              className={`event-card relative animate-on-scroll ${isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${0.2 * index}s` }}
            >
              {/* Event Icon */}
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <h3 className="font-bellota text-xl text-primary mb-2">{event.name}</h3>
              <p className="text-gray-600 font-semibold mb-1">{event.timeDisplay}</p>
              <p className="text-gray-500 text-sm mb-3">{event.location}</p>
              <p className="text-gray-400 text-xs mb-4">{event.address}</p>

              {/* Add to Calendar Button */}
              <div className="relative">
                <button
                  onClick={() => setActivePopover(activePopover === event.id ? null : event.id)}
                  className="btn-primary text-sm py-2 px-4"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Thêm vào lịch
                </button>

                {/* Calendar Popover */}
                {activePopover === event.id && (
                  <div
                    ref={popoverRef}
                    className="calendar-popover absolute left-1/2 -translate-x-1/2 bottom-full mb-2"
                  >
                    <a
                      href={generateGoogleCalendarUrl(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="calendar-popover-item"
                    >
                      {CalendarIcons.google}
                      <span>Google Calendar</span>
                    </a>
                    <button
                      onClick={() => generateICS(event)}
                      className="calendar-popover-item w-full"
                    >
                      {CalendarIcons.apple}
                      <span>Apple Calendar</span>
                    </button>
                    <button
                      onClick={() => generateICS(event)}
                      className="calendar-popover-item w-full"
                    >
                      {CalendarIcons.outlook}
                      <span>Outlook</span>
                    </button>
                    <a
                      href={generateGoogleCalendarUrl(event).replace('calendar.google.com/calendar', 'outlook.office.com/calendar')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="calendar-popover-item"
                    >
                      {CalendarIcons.microsoft365}
                      <span>Microsoft 365</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
