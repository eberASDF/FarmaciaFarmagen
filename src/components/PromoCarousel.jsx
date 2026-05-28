import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

export default function PromoCarousel({ banners }) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 300);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % banners.length);
  }, [current, banners.length, goTo]);

  const prev = useCallback(() => {
    goTo(current === 0 ? banners.length - 1 : current - 1);
  }, [current, banners.length, goTo]);

  // Auto-play
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[current];

  return (
    <div className="carousel" id="promo-carousel">
      {/* Background Image */}
      <div className="carousel-bg">
        <img
          src={banner.image}
          alt={banner.title}
          className={`carousel-bg-img ${isTransitioning ? "carousel-bg-img--fade" : ""}`}
        />
        <div className="carousel-bg-overlay" />
      </div>

      {/* Content */}
      <div className={`carousel-content ${isTransitioning ? "carousel-content--fade" : ""}`}>
        <span className="carousel-badge">Promoción Especial</span>
        <h2 className="carousel-title">{banner.title}</h2>
        <p className="carousel-subtitle">{banner.subtitle}</p>
        <Link to={banner.ctaLink} className="carousel-cta">
          {banner.ctaText}
          <svg className="carousel-cta-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button onClick={prev} className="carousel-arrow carousel-arrow--left" aria-label="Anterior">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={next} className="carousel-arrow carousel-arrow--right" aria-label="Siguiente">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="carousel-dots">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`carousel-dot ${i === current ? "carousel-dot--active" : ""}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
