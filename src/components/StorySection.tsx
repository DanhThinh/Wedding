import { useWedding } from '../hooks/useWedding';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function StorySection() {
  const { data } = useWedding();
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.1 });

  return (
    <section id="story" ref={ref} className="py-20 bg-gray-50">
      <div className="container-custom">
        <h2 className="section-title">Chuyện chúng mình</h2>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Timeline Line */}
          <div className="timeline-line hidden md:block" />

          {data.story.map((item, index) => (
            <div
              key={item.id}
              className={`relative mb-12 md:mb-16 animate-on-scroll ${isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${0.3 + index * 0.2}s` }}
            >
              {/* Mobile Layout */}
              <div className="md:hidden">
                <div className="flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 w-10 flex flex-col items-center">
                    <div className="w-4 h-4 bg-primary rounded-full border-4 border-white shadow-md" />
                    {index < data.story.length - 1 && (
                      <div className="w-0.5 h-full bg-primary mt-2 min-h-[200px]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    {item.label && (
                      <span className="text-xs text-primary font-semibold uppercase tracking-wider">
                        {item.label}
                      </span>
                    )}
                    <div className="mt-2 bg-white rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x300?text=Story+${item.id}`;
                        }}
                      />
                      <div className="p-4">
                        <h4 className="font-bellota text-lg text-primary mb-2">{item.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">{item.content}</p>
                        <span className="text-xs text-gray-400">{item.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex items-center gap-8">
                {/* Left side (even items) or spacer (odd items) */}
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8' : ''}`}>
                  {index % 2 === 0 && (
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:-translate-y-2">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-64 object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x300?text=Story+${item.id}`;
                        }}
                      />
                      <div className="p-5">
                        {item.label && (
                          <span className="text-xs text-primary font-semibold uppercase tracking-wider">
                            {item.label}
                          </span>
                        )}
                        <h4 className="font-bellota text-xl text-primary mt-2 mb-3">{item.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">{item.content}</p>
                        <span className="text-sm text-gray-400">{item.date}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Center dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-6 h-6 bg-primary rounded-full border-4 border-white shadow-lg" />
                </div>

                {/* Right side (odd items) or spacer (even items) */}
                <div className={`w-1/2 ${index % 2 !== 0 ? 'pl-8' : ''}`}>
                  {index % 2 !== 0 && (
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:-translate-y-2">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-64 object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x300?text=Story+${item.id}`;
                        }}
                      />
                      <div className="p-5">
                        {item.label && (
                          <span className="text-xs text-primary font-semibold uppercase tracking-wider">
                            {item.label}
                          </span>
                        )}
                        <h4 className="font-bellota text-xl text-primary mt-2 mb-3">{item.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">{item.content}</p>
                        <span className="text-sm text-gray-400">{item.date}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
