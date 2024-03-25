uniform float uTime;

varying vec2 vUv;
varying float vTime;

void main()
{
    vUv = uv;
    vTime = uTime;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}