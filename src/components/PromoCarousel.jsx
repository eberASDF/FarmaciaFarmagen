import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, ShieldPlus } from "lucide-react";

export default function PromoCarousel({ banners }) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 260);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % banners.length);
  }, [current, banners.length, goTo]);

  const prev = useCallback(() => {
    goTo(current === 0 ? banners.length - 1 : current - 1);
  }, [current, banners.length, goTo]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 5200);
    return () => clearInterval(timer);
  }, [next, banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[current];

  return (
    <div className="carousel" id="promo-carousel">
      <div className="carousel-bg">
        <img
          src={banner.image}
          alt={banner.title}
          className={`carousel-bg-img ${isTransitioning ? "carousel-bg-img--fade" : ""}`}
        />
        <div className="carousel-bg-overlay" />
      </div>

      <div className={`carousel-content ${isTransitioning ? "carousel-content--fade" : ""}`}>
        <span className="carousel-badge">
          <ShieldPlus size={17} aria-hidden="true" />
          Promocion especial
        </span>
        <h2 className="carousel-title">{banner.title}</h2>
        <p className="carousel-subtitle">{banner.subtitle}</p>
        <Link to={banner.ctaLink} className="carousel-cta">
          {banner.ctaText}
          <ArrowRight className="carousel-cta-arrow" aria-hidden="true" />
        </Link>
      </div>

      {banners.length > 1 && (
        <>
          <button onClick={prev} className="carousel-arrow carousel-arrow--left" aria-label="Anterior">
            <ChevronLeft aria-hidden="true" />
          </button>
          <button onClick={next} className="carousel-arrow carousel-arrow--right" aria-label="Siguiente">
            <ChevronRight aria-hidden="true" />
          </button>
        </>
      )}

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
