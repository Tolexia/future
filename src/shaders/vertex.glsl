uniform float uTime;
uniform float uPaletteMultiplier;

varying vec2 vUv;
varying float vTime;
varying float vPaletteMultiplier;

void main()
{
    vUv = uv;
    vTime = uTime;
    vPaletteMultiplier = uPaletteMultiplier;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}