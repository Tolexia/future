varying vec2 vUv;
varying float vTime;

vec3 firePalette(float i) {

    // float T = 1400. + 1300.*i; 
    // vec3 L = vec3(7.4, 5.6, 4.4); 
    // L = pow(L,vec3(5.0)) * (exp(1.43876719683e5/(T*L))-1.0);

    float T = 7500. + 35300.*i; 
    vec3 L = vec3(1.0, vUv) * 2.5; 
    L = L * ( exp(1.48876719683e5/(T*L)) );

    return 1.0-exp(-5e8/L); 
}   

vec3 hash33(vec3 p) { 
    float n = sin(dot(p, vec3(7, 157, 113)));    
    return fract(vec3(2097152, 262144, 32768)*n); 
}

float voronoi(vec3 p) {
	vec3 b, r, g = floor(p);
	p = fract(p); 
	float d = 1.; 
	for(int j = -1; j <= 1; j++) {
	    for(int i = -1; i <= 1; i++) {
		    b = vec3(i, j, -1);
		    r = b - p + hash33(g+b);
		    d = min(d, dot(r,r));
		    b.z = 0.0;
		    r = b - p + hash33(g+b);
		    d = min(d, dot(r,r));
		    b.z = 1.;
		    r = b - p + hash33(g+b);
		    d = min(d, dot(r,r));	
	    }
	}
	return d;
}

float noiseLayers(in vec3 p) {
    vec3 t = vec3(0., 0., p.z+vTime); 
    float tot = 0., sum = 0., amp = 1.; 
    for (int i = 0; i < 6; i++) {
        tot += voronoi(p + t) * amp; 
        p *= 2.0; 
        t *= 1.5; 
        sum += amp; 
        amp *= 0.5; 
    }
    return tot/sum; 
}

void main()
{
    float PI = 3.1415926535897932384626433832795;

    // Fire 1 
	vec3 rd = normalize(vec3(vUv.x, vUv.y, PI / 8.0));
	float c = noiseLayers(rd*15.0); 
	vec3 col = firePalette(c);
	gl_FragColor = vec4(sqrt(col), 1.0);  

    // float angle = atan(vUv.x, vUv.y) + sin(vTime + 2.0); // 40

    // float strength = angle;
    
    // vec4 blackColor = vec4(0.0);
    // vec4 uvColor = vec4(1.0, vUv, 1.0);

    // vec4 mixedColor = mix(blackColor, uvColor, strength);

    // gl_FragColor = vec4(mixedColor);
}