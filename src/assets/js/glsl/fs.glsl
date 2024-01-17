varying vec2 vUv;

uniform sampler2D uTex;
uniform float uProgress;

void main() {
  vec4 color1 = texture2D(uTex, vUv);
  vec4 color2 = texture2D(uTex, vec2(vUv.x, uProgress));
  vec4 final = mix(color2, color1, step(vUv.x, uProgress));

  // vec4 final2 = vec4(final.rgb * uProgress, uProgress); //透過0 -> 1

  gl_FragColor = final;
}
