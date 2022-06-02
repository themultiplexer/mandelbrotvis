//language=GLSL
export const fragShaderCube = `

precision highp float;
precision highp int;

in vec3 fragCoord;
out vec4 outFragColor;

uniform vec3 iResolution;
uniform float iGlobalTime;
uniform float zoom;

const int MaxIterations = 90;
const vec2 Focus = vec2(0.0, 0.0);
 
vec3 color(int iteration, float sqLengthZ) {
    // If the point is within the mandlebrot set
    // just color it black
    if(iteration == MaxIterations)
        return vec3(0.0);

    // Else we give it a smoothed color
   	float ratio = (float(iteration) - log2(log2(sqLengthZ))) / float(MaxIterations);
 
    // Procedurally generated colors
    return mix(vec3(1.0, 0.0, 0.0), vec3(1.0, 1.0, 0.0), sqrt(ratio));
}
 
void main() {      
    // C is the aspect-ratio corrected UV coordinate.
    vec2 c = (-1.0 + 2.0 * fragCoord.xy) ;//* vec2(iResolution.x / iResolution.y, 1.0);
 
    // Apply scaling, then offset to get a zoom effect
    c = (c * exp(-zoom)) + Focus;
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
    	z = vec2(zr2 - zi2, 2.0 * z.x * z.y) + c;
        ++iteration;
    }
 
    // Generate the colors
    outFragColor = vec4(color(iteration, dot(z,z)), 1.0);
 
    // Apply gamma correction
    outFragColor.rgb = pow(outFragColor.rgb, vec3(0.5));
}
 
`;
