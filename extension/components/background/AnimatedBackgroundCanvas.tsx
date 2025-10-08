import { FragmentShader, GetShaderUniforms, VertexShader } from '@app/shader/animatedBg.ts';
import loadAndProcessImage from '@components/background/helper/loadAndProcessImage.ts';
import appStore from '@store/appStore.ts';
import waitForGlobal from '@utils/dom/waitForGlobal.ts';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from 'zustand';

const AnimatedBackgroundCanvas: React.FC<{ imageSrc: string | null }> = ({ imageSrc }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const uniformsRef = useRef<ReturnType<typeof GetShaderUniforms> | null>(null);
  const isFocusedRef = useRef(true);
  const { filter, autoStopAnimation } = useStore(appStore, (state) => state.bg.options);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = GetShaderUniforms();
    uniformsRef.current = uniforms;

    const UpdateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);

      const scaledWidth = width * window.devicePixelRatio;
      const scaledHeight = height * window.devicePixelRatio;
      const largestAxis = scaledWidth > scaledHeight ? 'X' : 'Y';
      const largestAxisSize = Math.max(scaledWidth, scaledHeight);

      uniforms.BackgroundCircleOrigin.value.set(scaledWidth / 2, scaledHeight / 2);
      uniforms.BackgroundCircleRadius.value = largestAxisSize * 1.5;

      uniforms.CenterCircleOrigin.value.set(scaledWidth / 2, scaledHeight / 2);
      uniforms.CenterCircleRadius.value = largestAxisSize * (largestAxis === 'X' ? 1 : 0.75);

      uniforms.LeftCircleOrigin.value.set(0, scaledHeight);
      uniforms.LeftCircleRadius.value = largestAxisSize * 0.75;

      uniforms.RightCircleOrigin.value.set(scaledWidth, 0);
      uniforms.RightCircleRadius.value = largestAxisSize * (largestAxis === 'X' ? 0.65 : 0.5);

      renderer.render(scene, camera); // render once when resizing else the background will be black
    };

    UpdateDimensions();

    const material = new THREE.ShaderMaterial({
      vertexShader: VertexShader,
      fragmentShader: FragmentShader,
      uniforms,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let frameId: number | null = null;
    let hasRenderedOnce = false;
    const animate = () => {
      const time = performance.now() / 3500;
      uniforms.Time.value = time;

      if (isFocusedRef.current || !hasRenderedOnce) {
        renderer.render(scene, camera);
        hasRenderedOnce = true;
      }

      frameId = requestAnimationFrame(animate);
    };
    animate(); // start animation loop

    window.addEventListener('resize', UpdateDimensions);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      window.removeEventListener('resize', UpdateDimensions);
    };
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      isFocusedRef.current = true;
    };

    const handleBlur = () => {
      isFocusedRef.current = false;
    };

    waitForGlobal<any>(() => window?._spicy_lyrics?.fullscreen).then((fullscreen) =>
      fullscreen?.onopen(handleBlur)
    );
    waitForGlobal<any>(() => window?._spicy_lyrics?.fullscreen).then((fullscreen) =>
      fullscreen?.onclose(handleFocus)
    );

    if (autoStopAnimation) {
      window.addEventListener('focus', handleFocus);
      window.addEventListener('blur', handleBlur);
    }

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [autoStopAnimation]);

  useEffect(() => {
    if (!imageSrc || !uniformsRef.current) return;

    const uniforms = uniformsRef.current;
    const prevTexture = uniforms.BlurredCoverArt.value;

    uniforms.PreviousBlurredCoverArt.value = prevTexture;

    uniforms.TextureFade.value = 0;

    let cancelled = false;

    setTimeout(() => {
      loadAndProcessImage(imageSrc, filter).then((newTexture) => {
        if (!newTexture || cancelled || !uniformsRef.current) return;

        uniforms.BlurredCoverArt.value = newTexture;

        const start = performance.now();
        const duration = 800;

        const fade = () => {
          if (!uniformsRef.current) return;

          const elapsed = performance.now() - start;

          const t = Math.min(elapsed / duration, 1);
          uniformsRef.current.TextureFade.value = t;

          if (t < 1) {
            requestAnimationFrame(fade);
          } else {
            if (prevTexture && prevTexture !== uniformsRef.current.BlurredCoverArt.value) {
              prevTexture.dispose();
            }
          }
        };

        fade();
      });
    }, 300);

    return () => {
      cancelled = true;
    };
  }, [imageSrc, filter]);

  return (
    <canvas
      ref={canvasRef}
      className="animated-bg-canvas"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: `${filter.opacity ?? 100}%`,
      }}
    />
  );
};

export default AnimatedBackgroundCanvas;
