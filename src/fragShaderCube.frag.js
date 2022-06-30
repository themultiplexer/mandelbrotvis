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

const int MaxIterations = 70;


vec2 rotate_point(float cx, float cy, float angle, vec2 p){
    return vec2(cos(angle) * (p.x - cx) - sin(angle) * (p.y - cy) + cx,
                sin(angle) * (p.x - cx) + cos(angle) * (p.y - cy) + cy);
}

vec4 color(int iteration, float sqLengthZ) {
    // If the point is within the mandlebrot set
    // just color it black
    if(iteration == MaxIterations)
        return vec4(1.0);

    // Else we give it a smoothed color
   	float ratio = sqrt((float(iteration) - log2(log2(sqLengthZ))) / float(MaxIterations));
    //float ratio = float(iteration) / float(MaxIterations);
 
    // Procedurally generated colors
    return vec4(mix(vec3(0.0, 0.0, 0.0), vec3(1.0, 0.0, 0.0), ratio), 1.0);
}
 
void main() {      
    // C is the aspect-ratio corrected UV coordinate.
    //vec2 c = (-1.0 + 2.0 * rotate_point(0.5, 0.5, rotation, gl_FragCoord.xy)) ;
    vec2 c = (-1.0 + 2.0 * gl_FragCoord.xy / u_resolution.xy) * vec2(u_resolution.x / u_resolution.y, 1.0);
 
    // Apply scaling, then offset to get a zoom effect
    c = (c * exp(-zoom)) + focus;
	vec2 z = c;
 
    int iteration = 0;
 
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
}
 
`;
