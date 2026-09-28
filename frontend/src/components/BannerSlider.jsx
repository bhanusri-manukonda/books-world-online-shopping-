import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    id: 1,
    tag: 'LIMITED TIME OFFER',
    title: 'Up to 45% OFF on Top Bestsellers',
    description:
      'Massive discounts across Self-Help, Fiction, Finance & Science books. Upgrade your personal library today!',
    buttonText: 'Shop Big Discounts',
    buttonLink: '/?sort=discount',
    accent: '#f59e0b',
    gradient: 'linear-gradient(135deg, #0e3b34 0%, #155e52 60%, #0d2823 100%)',
    badge: 'Save up to ₹400',
    icon: '⚡',
  },
  {
    id: 2,
    tag: 'NEW ARRIVALS 2026',
    title: 'Curated Fiction, Sci-Fi & Classics',
    description:
      'Immerse yourself in world-renowned literary triumphs from Paulo Coelho, George Orwell, Andy Weir and Arundhati Roy.',
    buttonText: 'Explore New Titles',
    buttonLink: '/?sort=newest',
    accent: '#60a5fa',
    gradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 60%, #1e1b4b 100%)',
    badge: '60+ Real Books Available',
    icon: '✨',
  },
  {
    id: 3,
    tag: 'ANDHRA PRADESH FAST DELIVERY',
    title: 'Doorstep Delivery Across All AP Cities',
    description:
      'Express shipping to Visakhapatnam, Vijayawada, Kakinada, Rajahmundry, Guntur, Tirupati, Nellore and beyond! FREE shipping on orders above ₹500.',
    buttonText: 'Order Now',
    buttonLink: '/#books-section',
    accent: '#10b981',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 60%, #022c22 100%)',
    badge: 'Free Delivery > ₹500',
    icon: '🚚',
  },
  {
    id: 4,
    tag: 'DEVELOPER & TECH FEST',
    title: 'Master Programming, Clean Code & Algorithms',
    description:
      'Supercharge your engineering career with industry benchmarks: Clean Code, Introduction to Algorithms, Pragmatic Programmer, and JavaScript deep-dives.',
    buttonText: 'Browse Technology',
    buttonLink: '/?category=Technology',
    accent: '#a78bfa',
    gradient: 'linear-gradient(135deg, #311042 0%, #4c1d95 60%, #1e1b4b 100%)',
    badge: 'High Discounted Tech Books',
    icon: '💻',
  },
];

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);

  const total = SLIDES.length;

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  useEffect(() => {
    if (!isPaused) {
      timeoutRef.current = setTimeout(() => {
        nextSlide();
      }, 5000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, isPaused]);

  return (
    <div
      className="banner-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Promotional banner slider"
    >
      <div className="slider-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {SLIDES.map((slide) => (
          <div
            key={slide.id}
            className="slider-item"
            style={{ background: slide.gradient }}
          >
            <div className="slider-content">
              <div className="slider-tag-wrap">
                <span className="slider-badge" style={{ borderColor: slide.accent, color: slide.accent }}>
                  {slide.icon} {slide.tag}
                </span>
                <span className="slider-pill">{slide.badge}</span>
              </div>
              <h2 className="slider-title">{slide.title}</h2>
              <p className="slider-desc">{slide.description}</p>
              <div className="slider-actions">
                <Link to={slide.buttonLink} className="btn-amber slider-btn">
                  {slide.buttonText} →
                </Link>
                <a href="#books-section" className="btn-ghost slider-btn-secondary">
                  Browse Catalog
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        className="slider-arrow slider-arrow-prev"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        type="button"
        className="slider-arrow slider-arrow-next"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Dots Indicator */}
      <div className="slider-dots">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`slider-dot ${index === current ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
