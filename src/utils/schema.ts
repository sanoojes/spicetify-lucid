import z from 'zod';

export function boundedNumber({ name, min, max }: { name: string; min: number; max: number }) {
  return z
    .number()
    .min(min, `${name} must be at least ${min}`)
    .max(max, `${name} can't exceed ${max}`);
}
