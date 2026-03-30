// taken from: https://github.com/davidhu2000/react-spinners/blob/main/src/PuffLoader.tsx

import type { CSSProperties, DetailedHTMLProps, HTMLAttributes } from 'react';

type CommonProps = DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> & {
  color?: string;
  loading?: boolean;
  cssOverride?: CSSProperties;
  speedMultiplier?: number;
};

type LoaderSizeProps = CommonProps & {
  size?: number;
};

function Loader({
  loading = true,
  color = 'var(--clr-on-surface, #fff)',
  speedMultiplier = 1,
  cssOverride = {},
  size = 60,
  ...additionalprops
}) {
  const wrapper: CSSProperties = {
    display: 'inherit',
    position: 'relative',
    width: `${size}px`,
    height: `${size}px`,
    ...cssOverride,
  };

  const style = (i: number): CSSProperties => {
    return {
      position: 'absolute',
      height: `${size}px`,
      width: `${size}px`,
      border: `thick solid ${color}`,
      borderRadius: '50%',
      opacity: '1',
      top: '0',
      left: '0',
      animationFillMode: 'both',
      animation: `puff-1, puff-2`,
      animationDuration: `${2 / speedMultiplier}s`,
      animationIterationCount: 'infinite',
      animationTimingFunction:
        'cubic-bezier(0.165, 0.84, 0.44, 1), cubic-bezier(0.3, 0.61, 0.355, 1)',
      animationDelay: i === 1 ? '-1s' : '0s',
    };
  };

  if (!loading) {
    return null;
  }

  return (
    <span style={wrapper} {...additionalprops}>
      <span style={style(1)} />
      <span style={style(2)} />
    </span>
  );
}

export default Loader;
