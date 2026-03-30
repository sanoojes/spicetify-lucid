import { useCallback, useEffect, useRef } from 'react';

type MarqueeProps = {
  children: React.ReactNode;
  className?: string;
  speed?: number;
};

const Marquee: React.FC<MarqueeProps> = ({ children, speed = 12, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const isPaused = useRef(false);

  const getDistance = () => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return 0;
    return Math.max(content.scrollWidth - container.offsetWidth, 0);
  };

  const setupAnimation = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;

    const distance = getDistance();
    if (distance <= 0) return;

    const duration = Math.max((distance / speed) * 1000, 5000);
    const isRTL = getComputedStyle(content).direction === 'rtl';
    const from = 'translateX(0)';
    const to = `translateX(-${distance}px)`;

    const keyframes = isRTL
      ? [{ transform: to }, { transform: from }]
      : [{ transform: from }, { transform: to }];

    animationRef.current?.cancel();

    const animation = content.animate(keyframes, {
      duration,
      iterations: 2,
      direction: 'alternate',
      easing: 'ease-in-out',
      fill: 'forwards',
      composite: 'replace',
    });

    animationRef.current = animation;
    if (isPaused.current) animation.pause();
  }, [speed]);

  useEffect(() => {
    const handleResize = () => {
      const distance = getDistance();
      if (distance <= 0) {
        animationRef.current?.cancel();
        animationRef.current = null;
      } else {
        setupAnimation();
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      animationRef.current?.cancel();
    };
  }, [children, setupAnimation]);

  const pause = () => {
    isPaused.current = true;
    animationRef.current?.pause();
  };

  const resume = () => {
    isPaused.current = false;
    animationRef.current?.play();
  };

  return (
    <div
      ref={containerRef}
      onPointerEnter={pause}
      onPointerLeave={resume}
      onFocus={pause}
      onBlur={resume}
      className={className}
    >
      <div className="marquee-overlay">
        <div className="marquee-container">
          <span ref={contentRef} className="marquee-wrapper">
            {children}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Marquee;
