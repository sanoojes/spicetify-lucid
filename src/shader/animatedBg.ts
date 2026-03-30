import * as THREE from 'three';

// Updated Uniforms
const Uniforms = `
uniform float Time;
uniform float TextureFade;

uniform sampler2D BlurredCoverArt;
uniform sampler2D PreviousBlurredCoverArt;

uniform vec2 BackgroundCircleOrigin;
uniform float BackgroundCircleRadius;

uniform vec2 CenterCircleOrigin;
uniform float CenterCircleRadius;

uniform vec2 LeftCircleOrigin;
uniform float LeftCircleRadius;

uniform vec2 RightCircleOrigin;
uniform float RightCircleRadius;
`;

export type ShaderUniforms = {
  Time: { value: number };
  TextureFade: { value: number };
  BlurredCoverArt: { value: THREE.Texture };
  PreviousBlurredCoverArt: { value: THREE.Texture };

  BackgroundCircleOrigin: { value: THREE.Vector2 };
  BackgroundCircleRadius: { value: number };

  CenterCircleOrigin: { value: THREE.Vector2 };
  CenterCircleRadius: { value: number };

  LeftCircleOrigin: { value: THREE.Vector2 };
  LeftCircleRadius: { value: number };

  RightCircleOrigin: { value: THREE.Vector2 };
  RightCircleRadius: { value: number };
};

export const VertexShader = `
void main() {
	gl_Position = vec4(position, 1.0);
}
`;

export const FragmentShader = `
${Uniforms}

const vec2 rotateCenter = vec2(0.5, 0.5);
vec2 RotateAroundCenter(vec2 point, float angle) {
	vec2 offset = (point - rotateCenter);
	float s = sin(angle);
	float c = cos(angle);
	mat2 rotation = mat2(c, -s, s, c);
	offset = (rotation * offset);
	return (rotateCenter + offset);
}

vec4 GetBlendedTextureColor(vec2 uv, float angle) {
	vec2 rotatedUV = RotateAroundCenter(uv, angle);
	vec4 prevColor = texture2D(PreviousBlurredCoverArt, rotatedUV);
	vec4 newColor = texture2D(BlurredCoverArt, rotatedUV);
	return mix(prevColor, newColor, TextureFade);
}

const vec4 DefaultColor = vec4(0.0, 0.0, 0.0, 0.0);

void main() {
	gl_FragColor = DefaultColor;

	vec2 bgOffset = gl_FragCoord.xy - BackgroundCircleOrigin;
	if (length(bgOffset) <= BackgroundCircleRadius) {
		vec2 uv = ((bgOffset / BackgroundCircleRadius) + 1.0) * 0.5;
		gl_FragColor = GetBlendedTextureColor(uv, Time * -0.25);
		gl_FragColor.a = 1.0;
	}

	vec2 centerOffset = gl_FragCoord.xy - CenterCircleOrigin;
	if (length(centerOffset) <= CenterCircleRadius) {
		vec2 uv = ((centerOffset / CenterCircleRadius) + 1.0) * 0.5;
		vec4 color = GetBlendedTextureColor(uv, Time * 0.5);
		color.a *= 0.75;

		gl_FragColor.rgb = (color.rgb * color.a) + (gl_FragColor.rgb * (1.0 - color.a));
		gl_FragColor.a = color.a + (gl_FragColor.a * (1.0 - color.a));
	}

	vec2 leftOffset = gl_FragCoord.xy - LeftCircleOrigin;
	if (length(leftOffset) <= LeftCircleRadius) {
		vec2 uv = ((leftOffset / LeftCircleRadius) + 1.0) * 0.5;
		vec4 color = GetBlendedTextureColor(uv, Time * 1.0);
		color.a *= 0.5;

		gl_FragColor.rgb = (color.rgb * color.a) + (gl_FragColor.rgb * (1.0 - color.a));
		gl_FragColor.a = color.a + (gl_FragColor.a * (1.0 - color.a));
	}

	vec2 rightOffset = gl_FragCoord.xy - RightCircleOrigin;
	if (length(rightOffset) <= RightCircleRadius) {
		vec2 uv = ((rightOffset / RightCircleRadius) + 1.0) * 0.5;
		vec4 color = GetBlendedTextureColor(uv, Time * -0.75);
		color.a *= 0.5;

		gl_FragColor.rgb = (color.rgb * color.a) + (gl_FragColor.rgb * (1.0 - color.a));
		gl_FragColor.a = color.a + (gl_FragColor.a * (1.0 - color.a));
	}
}
`;

const ShaderUniformStructure: Map<string, string> = new Map();
for (const match of Uniforms.matchAll(/uniform\s+(\w+)\s+(\w+);/g)) {
  const uniformType = match[1];
  const uniformName = match[2];
  ShaderUniformStructure.set(uniformName, uniformType);
}

export const GetShaderUniforms = (): ShaderUniforms => {
  const uniforms: Record<string, unknown> = {};
  for (const [uniformName, uniformType] of ShaderUniformStructure.entries()) {
    if (uniformType === 'float') {
      uniforms[uniformName] = { value: uniformName === 'TextureFade' ? 1.0 : 0 };
    } else if (uniformType === 'vec2') {
      uniforms[uniformName] = { value: new THREE.Vector2() };
    } else if (uniformType === 'sampler2D') {
      const blankCanvas = document.createElement('canvas');
      blankCanvas.width = blankCanvas.height = 2;
      const ctx = blankCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      }
      const texture = new THREE.CanvasTexture(blankCanvas);
      uniforms[uniformName] = { value: texture };
    }
  }

  return uniforms as ShaderUniforms;
};
