precision mediump float;
#pragma glslify: easeBack = require(glsl-easings/back-in-out)

varying vec2 vUv;
uniform float uFluctuation;

void main() {
    vUv = uv;
    vec3 pos = position;

    float uvDelayCenter = distance(vec2(0.5,0.5),uv) / distance(vec2(0.,0.), vec2(.5,.5)); // 中央からの動き
    float uvDelayToRightBottom = distance(vec2(0.,1.),uv) / distance(vec2(0.,1.), vec2(1.,0.)); //左上から右下の動き
    float uvDelayToRightTop = distance(vec2(0.,0.),uv) / distance(vec2(0.,0.), vec2(1.,1.)); //左下から右上の動き
    float delay = clamp(uFluctuation * 1.4 - uvDelayToRightBottom * 0.3, 0., 1.);
    float progress = easeBack(delay);
    // pos.x += progress * 50.;
    pos.z += progress * 400.;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
