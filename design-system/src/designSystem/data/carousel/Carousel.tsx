import { useCallback, useEffect, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useStableId } from '../../utils/useStableId';

import styles from './carousel.module.css';

export type CarouselSlide = {
  id: string;
  content: ReactNode;
  label?: string;
};

export type CarouselProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  slides: CarouselSlide[];
  value?: number;
  defaultValue?: number;
  onValueChange?: (index: number) => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loop?: boolean;
  ariaLabel?: string;
};

export function Carousel({
  slides,
  value,
  defaultValue = 0,
  onValueChange,
  autoPlay = false,
  autoPlayInterval = 5000,
  loop = true,
  ariaLabel = 'Carousel',
  className,
  ...rest
}: CarouselProps) {
  const [index, setIndex] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const regionId = useStableId('ds-carousel');

  const goTo = useCallback(
    (next: number) => {
      if (slides.length === 0) return;
      let target = next;
      if (loop) {
        target = ((next % slides.length) + slides.length) % slides.length;
      } else {
        target = Math.max(0, Math.min(slides.length - 1, next));
      }
      setIndex(target);
    },
    [loop, setIndex, slides.length],
  );

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const timer = window.setInterval(() => goTo((index ?? 0) + 1), autoPlayInterval);
    return () => window.clearInterval(timer);
  }, [autoPlay, autoPlayInterval, goTo, index, slides.length]);

  const current = index ?? 0;

  return (
    <div
      {...rest}
      id={regionId}
      className={cn(styles.root, className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <div className={styles.viewport} aria-live="polite">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={cn(styles.slide, i === current && styles.active)}
            role="group"
            aria-roledescription="slide"
            aria-label={slide.label ?? `Slide ${i + 1} of ${slides.length}`}
            hidden={i !== current}
          >
            {slide.content}
          </div>
        ))}
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => goTo(current - 1)}
          disabled={!loop && current === 0}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <div className={styles.dots} role="tablist" aria-label="Slide navigation">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={slide.label ?? `Go to slide ${i + 1}`}
              className={cn(styles.dot, i === current && styles.dotActive)}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => goTo(current + 1)}
          disabled={!loop && current === slides.length - 1}
          aria-label="Next slide"
        >
          ›
        </button>
      </div>
    </div>
  );
}
