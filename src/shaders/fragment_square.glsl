
varying vec2 vUv;
varying float vTime;

float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    // return fract(sin(dot(st.xy, vec2(12.9898,8.233))));
}

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main()
{
    float PI = 3.1415926535897932384626433832795;
    // float strength = vUv.x; // 3
    // float strength = vUv.y; // 4
    // float strength = 1.0 - vUv.y; // 5
    // float strength = vUv.y * 10.0; // 6
    // float strength = mod(vUv.y * 10.0, 1.0); // 7
    // strength = step(0.4, strength); // 8
    // strength = step(0.8, mod(vUv.y * 10.0, 1.0)); // 9
    // strength = step(0.8, mod(vUv.x * 10.0, 1.0)); // 10

    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0)); // 11, 12

    // 11
    // strength += step(0.8, mod(vUv.y * 10.0, 1.0)); 
    // strength = clamp(strength, 0.0, 1.0);

    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0)); // 12 => Nice

    // float strength = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0)); // 13

    // 14
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
    // float strength = barX + barY;
    // strength = clamp(strength, 0.0, 1.0);

    // 15
    // float barX = step(0.4, mod(vUv.x * 10.0 - 0.2, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0 - 0.2, 1.0));
    // float strength = barX + barY;
    // strength = clamp(strength, 0.0, 1.0);

    // float strength = abs(vUv.x - 0.5); // 16
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5)); // 17
    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)); // 18
    
    // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5))); // 19
    float strength = step(0.4, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5))); // 20 : Thin square 

    // float strength = floor(vUv.x * 10.0) / 10.0; // 21
    // float strength = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0; // 22
    // float strength = random(vUv); // 23 : Noise

    // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor((vUv.y/2.0) * 10.0) / 10.0); // 24
    // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor((vUv.y + vUv.x/2.0) * 10.0) / 10.0); // 25
    // float strength = random(gridUv);

    // float strength = length(vUv); // 26
    // float strength = distance(vUv, vec2(0.5)); // 27
    // float strength = 1.0 - distance(vUv, vec2(0.5)); // 28
    // float strength = 0.015 / (distance(vUv, vec2(0.5))); // 29 : Light Point with gradient => Niceww
    // float strength = 0.15 / (distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5))); // 30

    // 31
    // float strength = 0.15 / (distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5)));
    // strength *= 0.15 / (distance(vec2(vUv.y, (vUv.x - 0.5) * 5.0 + 0.5), vec2(0.5)));

    // 32
    // vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));
    // float strength = 0.15 / (distance(vec2(rotatedUv.x, (rotatedUv.y - 0.5) * 5.0 + 0.5), vec2(0.5)));
    // strength *= 0.15 / (distance(vec2(rotatedUv.y, (rotatedUv.x - 0.5) * 5.0 + 0.5), vec2(0.5)));

    // float strength = step(0.5, distance(vUv, vec2(0.5)) + 0.25); // 33
    // float strength = abs(distance(vUv, vec2(0.5)) - 0.25); // 34
    // float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25)); // 35
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25)); // 36 : White Disc => Pépite

    // vec2 wavedUv = vec2(
    //     vUv.x + tan(vUv.y * 30.0) * 0.015,           // SO NICE
    //     vUv.y + tan(vUv.x * 30.0) * 0.015
    // ); 

    // 37
    // vec2 wavedUv = vec2(
    //     vUv.x,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );

    // 38
    // vec2 wavedUv = vec2(
    //     vUv.x + sin(vUv.y * 30.0) * 0.1,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );

    // 39
    // vec2 wavedUv = vec2(
    //     vUv.x + sin(vUv.y * 100.0) * 0.1,
    //     vUv.y + sin(vUv.x * 100.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25  + vTime / 150.0));

    // float angle = atan(vUv.x, vUv.y); // 40

    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5); // 41

    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5; // 42

    // float angle = mod(atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) * 30.0, 1.0); // 43 : Looney Tunes intro vibes 

    // float angle = sin(atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) * 100.0); // 44 : effet drapeau soleil levant
 
    // float angle = sin(atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) * 5000.0); // Not in the course but interesting (psyche)

    // float strength = angle;

    // 45
    //float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
    //float radius = 0.25 + sin(angle * 100.0) * 0.02;
    //float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

    // float strength = cnoise(vUv * 10.0); // 46
    // float strength = step(0.01, cnoise(vUv * 10.0)); // 47
    // float strength = 1.0 - abs(cnoise(vUv * 10.0)); // 48
    // float strength = sin(cnoise(vUv * 10.0) * 20.0); // 49
    // float strength = step(0.9,sin(cnoise(vUv * 10.0) * 20.0)); // 50

    vec4 blackColor = vec4(0.0);
    vec4 uvColor = vec4(1.0, vUv, 1.0);
    // vec4 cyan = vec4(0.0, 1.0, 1.0, , 1.0);
    
    // vec4 mixedColor = mix(blackColor, cyan, strength); // Test with cyan => nice

    vec4 mixedColor = mix(blackColor, uvColor, strength);

    // gl_FragColor = vec4(1.0, vUv, 1.0); // 1

    // gl_FragColor = vec4(vec3(strength), 1.0); // black & white patterns

    gl_FragColor = vec4(mixedColor);
}