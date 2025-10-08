import type { CSSFilter } from '@app/types/appStore.ts';
import serializeFilters from '@utils/dom/serializeFilters.ts';
import * as THREE from 'three';

async function loadAndProcessImage(
  url: string | null,
  filter: CSSFilter
): Promise<THREE.Texture | null> {
  try {
    if (!url) {
      console.warn('No image URL provided');
      return null;
    }

    const image = new Image();
    image.src = url;
    image.crossOrigin = url.startsWith('spotify:') ? null : 'anonymous';
    await image.decode();

    const originalSize = Math.min(image.width, image.height);
    const blurExtent = Math.ceil(3 * 40);
    const padding = blurExtent * 1.5;
    const expandedSize = originalSize + padding;

    const circleCanvas = new OffscreenCanvas(originalSize, originalSize);
    const ctx = circleCanvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D context for circleCanvas');
      return null;
    }

    ctx.beginPath();
    ctx.arc(originalSize / 2, originalSize / 2, originalSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(
      image,
      (image.width - originalSize) / 2,
      (image.height - originalSize) / 2,
      originalSize,
      originalSize,
      0,
      0,
      originalSize,
      originalSize
    );

    const blurredCanvas = new OffscreenCanvas(expandedSize, expandedSize);
    const blurredCtx = blurredCanvas.getContext('2d');
    if (!blurredCtx) {
      console.error('Failed to get 2D context for blurredCanvas');
      return null;
    }

    blurredCtx.filter = serializeFilters(filter, { skipOpacity: true });
    blurredCtx.drawImage(circleCanvas, padding / 2, padding / 2);

    const texture = new THREE.CanvasTexture(blurredCanvas);
    texture.needsUpdate = true;
    return texture;
  } catch (err) {
    console.error('Failed to load/process image:', err);
    return null;
  }
}

export default loadAndProcessImage;
