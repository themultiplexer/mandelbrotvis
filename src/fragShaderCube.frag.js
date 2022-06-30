//language=GLSL
export const fragShaderCube = `

precision highp float;
precision highp int;

in vec3 fragCoord;
in float dist;

uniform vec3 iResolution;
uniform vec3 u_resolution;
uniform float[2] colormap;
uniform float iGlobalTime;
uniform float zoom;
uniform float rotation;
uniform vec2 focus;
uniform bool fixedPoint;

const int MaxIterations = 100;
const int MaxIterationsFixed = 1000;
#define SHIFT 28u

int   initFixed(float x) {return int(x * float(1u << SHIFT));}
ivec2 initFixed(vec2  v) {return ivec2(initFixed(v.x), initFixed(v.y));}
// Fixed point squaring
int squareFixed(int a) {
    uint ua = uint(abs(a));
    uint ah = ua >> 16u;
    uint al = ua & 0xFFFFu;
    return int((ah * ah << 32u - SHIFT) + (ah * al >> SHIFT - 17u) + (al * al >> SHIFT));
}
ivec2 squareFixed(ivec2 v) {return ivec2(squareFixed(v.x), squareFixed(v.y));}


vec2 rotate_point(float cx, float cy, float angle, vec2 p){
    return vec2(cos(angle) * (p.x - cx) - sin(angle) * (p.y - cy) + cx,
                sin(angle) * (p.x - cx) + cos(angle) * (p.y - cy) + cy);
}

vec3 spectral_color(float l) {
    float t;  vec3 c=vec3(0.0,0.0,0.0);
         if ((l>=400.0)&&(l<410.0)) { t=(l-400.0)/(410.0-400.0); c.r=    +(0.33*t)-(0.20*t*t); }
    else if ((l>=410.0)&&(l<475.0)) { t=(l-410.0)/(475.0-410.0); c.r=0.14         -(0.13*t*t); }
    else if ((l>=545.0)&&(l<595.0)) { t=(l-545.0)/(595.0-545.0); c.r=    +(1.98*t)-(     t*t); }
    else if ((l>=595.0)&&(l<650.0)) { t=(l-595.0)/(650.0-595.0); c.r=0.98+(0.06*t)-(0.40*t*t); }
    else if ((l>=650.0)&&(l<700.0)) { t=(l-650.0)/(700.0-650.0); c.r=0.65-(0.84*t)+(0.20*t*t); }
         if ((l>=415.0)&&(l<475.0)) { t=(l-415.0)/(475.0-415.0); c.g=             +(0.80*t*t); }
    else if ((l>=475.0)&&(l<590.0)) { t=(l-475.0)/(590.0-475.0); c.g=0.8 +(0.76*t)-(0.80*t*t); }
    else if ((l>=585.0)&&(l<639.0)) { t=(l-585.0)/(639.0-585.0); c.g=0.84-(0.84*t)           ; }
         if ((l>=400.0)&&(l<475.0)) { t=(l-400.0)/(475.0-400.0); c.b=    +(2.20*t)-(1.50*t*t); }
    else if ((l>=475.0)&&(l<560.0)) { t=(l-475.0)/(560.0-475.0); c.b=0.7 -(     t)+(0.30*t*t); }
    return c;
}

vec4 color(int iteration, float sqLengthZ) {
    // If the point is within the mandlebrot set
    // just color it black
    if(iteration == MaxIterations)
        return vec4(0.0, 0.0, 0.0, 1.0);

    // Else we give it a smoothed color
   	float ratio = sqrt((float(iteration) - log2(log2(sqLengthZ))) / float(MaxIterations));
    //float ratio = float(iteration) / float(MaxIterations);
 
    // Procedurally generated colors
    //return vec4(mix(vec3(0.0, 0.0, 0.0), vec3(1.0, 0.0, 0.0), ratio), 1.0);
    float q=float(iteration)/float(MaxIterations);
    q=pow(q,0.2);
    return vec4(spectral_color(400.0+(300.0*q)), 1.0);
}
 
void main() {
    // C is the aspect-ratio corrected UV coordinate.
    //vec2 c = (-1.0 + 2.0 * rotate_point(0.5, 0.5, rotation, gl_FragCoord.xy)) ;
    vec2 c = (-1.0 + 2.0 * gl_FragCoord.xy / u_resolution.xy) * vec2(u_resolution.x / u_resolution.y, 1.0);
    int iteration = 0;

    if(fixedPoint){
        // Apply scaling, then offset to get a zoom effect
        c = (c * exp(-zoom)) + focus;
        vec2 z = c;
    
        while(iteration < MaxIterations) {
            // Precompute for efficiency
            float zr2 = z.x * z.x;
            float zi2 = z.y * z.y;
    
            // The larger the square length of Z,
            // the smoother the shading
            if(zr2 + zi2 > 32.0) break;
    
            // Complex multiplication, then addition
            z = vec2(zr2 - zi2, (z.x * z.y) + (z.x * z.y)) + c;
            ++iteration;
        }
    
        // Generate the colors
        gl_FragColor = color(iteration, dot(z,z));
        // Apply gamma correction
        gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(0.5));
    } else {
        // Fixed point version
        vec2 U = (2.0 * gl_FragCoord.xy - u_resolution.xy) / u_resolution.y;
	    ivec2 nc = initFixed(U * exp(-zoom)) + initFixed(focus); // more precise doing that way
        ivec2 z = nc;

        // Check divergence against a square (not circle) of size 4
        // Numbers can be kept smaller and we can be more aggressive with SHIFT, before getting overflows
        while (iteration < MaxIterationsFixed && all(lessThan(abs(z), initFixed(vec2(2))))) {
            ivec2 Z2 = squareFixed(z);
            z = ivec2(Z2.x, squareFixed(z.x + z.y) - Z2.x) - Z2.yy + nc;
            ++iteration;
        }
        // Generate the colors
        //gl_FragColor = color(iteration, float((z.x * z.x) + (z.y * z.y)));
        // Apply gamma correction
        //gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(0.5));

        float t = float(iteration)/float(MaxIterationsFixed);
        gl_FragColor = vec4(iteration < MaxIterationsFixed ? 0.5 - 0.5 * cos(6.2831853 * (t + vec3(-0.1, 0.0, 0.1))) : vec3(0.0), 1.0);
    }
}
 
`;
