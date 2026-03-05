import { useEffect, useRef } from "react"

const VERT_SRC = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const FRAG_SRC = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;

  vec3 palette(float t) {
    vec3 a = vec3(0.05, 0.05, 0.08);
    vec3 b = vec3(0.12, 0.10, 0.18);
    vec3 c = vec3(0.30, 0.20, 0.50);
    vec3 d = vec3(0.60, 0.40, 0.80);
    return a + b * cos(6.28318 * (c * t + d));
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), u.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.x *= u_resolution.x / u_resolution.y;

    float t = u_time * 0.18;

    vec2 q = vec2(fbm(uv + t * 0.5), fbm(uv + vec2(1.0)));
    vec2 r = vec2(
      fbm(uv + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t),
      fbm(uv + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t)
    );

    float f = fbm(uv + r);

    vec3 color = mix(
      mix(vec3(0.02, 0.01, 0.04), vec3(0.08, 0.05, 0.14), clamp(f * f * 4.0, 0.0, 1.0)),
      mix(vec3(0.10, 0.06, 0.20), vec3(0.25, 0.12, 0.45), clamp(length(q), 0.0, 1.0)),
      clamp(length(r.x), 0.0, 1.0)
    );

    color = (f * f * f + 0.6 * f * f + 0.5 * f) * color;

    // Subtle chromatic wave
    float wave = sin(uv.y * 8.0 + t * 2.0) * 0.015;
    vec3 shifted = palette(f + wave + t * 0.1) * 0.3;
    color += shifted * 0.4;

    // Vignette
    vec2 vig = uv - 0.5;
    vig.x *= u_resolution.x / u_resolution.y;
    float vignette = 1.0 - dot(vig, vig) * 1.2;
    color *= clamp(vignette, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
  }
`

function createShader(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  return shader
}

export function WebGLShader({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl")
    if (!gl) return

    const vert = createShader(gl, gl.VERTEX_SHADER, VERT_SRC)
    const frag = createShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC)

    const program = gl.createProgram()!
    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)
    gl.useProgram(program)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    )

    const pos = gl.getAttribLocation(program, "position")
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(program, "u_time")
    const uRes = gl.getUniformLocation(program, "u_resolution")

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let start = performance.now()
    const render = () => {
      const t = (performance.now() - start) / 1000
      gl.uniform1f(uTime, t)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      rafRef.current = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  )
}
