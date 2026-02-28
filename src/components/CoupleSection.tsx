import { useState } from 'react';
import { useWedding } from '../hooks/useWedding';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function CoupleSection() {
  const { data } = useWedding();
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.2 });
  const [expandedGroom, setExpandedGroom] = useState(false);
  const [expandedBride, setExpandedBride] = useState(false);

  return (
    <section id="couple" ref={ref} className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Groom Card */}
          <div 
            className={`couple-card animate-on-scroll animate-left ${isVisible ? 'visible' : ''}`}
            style={{ transitionDelay: '0.3s' }}
          >
            <div className="couple-image">
              <img 
                src={data.groom.image} 
                alt={data.groom.fullName}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=Groom';
                }}
              />
            </div>
            <div className="couple-role">The Groom</div>
            <h3 className="couple-name">{data.groom.fullName}</h3>
            <p className={`text-gray-600 text-sm leading-relaxed ${expandedGroom ? '' : 'line-clamp-3'}`}>
              {data.groom.description}
            </p>
            <button
              onClick={() => setExpandedGroom(!expandedGroom)}
              className="text-primary mt-3 text-sm hover:underline"
            >
              {expandedGroom ? 'Thu gọn' : 'Xem thêm'}
            </button>
          </div>

          {/* Bride Card */}
          <div 
            className={`couple-card animate-on-scroll animate-right ${isVisible ? 'visible' : ''}`}
            style={{ transitionDelay: '0.5s' }}
          >
            <div className="couple-image">
              <img 
                src={data.bride.image} 
                alt={data.bride.fullName}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=Bride';
                }}
              />
            </div>
            <div className="couple-role">The Bride</div>
            <h3 className="couple-name">{data.bride.fullName}</h3>
            <p className={`text-gray-600 text-sm leading-relaxed ${expandedBride ? '' : 'line-clamp-3'}`}>
              {data.bride.description}
            </p>
            <button
              onClick={() => setExpandedBride(!expandedBride)}
              className="text-primary mt-3 text-sm hover:underline"
            >
              {expandedBride ? 'Thu gọn' : 'Xem thêm'}
            </button>
          </div>
        </div>

        {/* Intro Text */}
        <div 
          className={`text-center mt-16 max-w-2xl mx-auto animate-on-scroll ${isVisible ? 'visible' : ''}`}
          style={{ transitionDelay: '0.7s' }}
        >
          <h3 className="font-oooh text-2xl text-primary mb-4">{data.intro.title}</h3>
          <p className="text-gray-600 leading-relaxed mb-6">{data.intro.content}</p>
          <p className="font-bellota text-xl text-primary">
            {data.groom.shortName} & {data.bride.shortName}
          </p>
        </div>
      </div>
    </section>
  );
}
