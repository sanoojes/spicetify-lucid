import { boundedNumber } from '@/utils/schema.ts';
import z from 'zod';

const CSSFilterSchema = z.object({
  blur: boundedNumber({ name: 'Blur', min: 0, max: 256 }),
  brightness: boundedNumber({ name: 'Brightness', min: 0, max: 200 }),
  contrast: boundedNumber({ name: 'Contrast', min: 0, max: 200 }),
  saturation: boundedNumber({ name: 'Saturation', min: 0, max: 200 }),
  opacity: boundedNumber({ name: 'Opacity', min: 0, max: 100 }),
});

export default CSSFilterSchema;
