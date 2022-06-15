//language=GLSL
export const vertShaderCube = `

out vec3 fragCoord;
out float dist;
uniform vec3 boxLength;
uniform float zoom;
uniform vec2 focus;
out vec3 localposVertex;


void main() {
    fragCoord = ((position + boxLength / 2.0) / boxLength);// + vec3(exp(zoom / 40.0),0.0, 0.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    dist = gl_Position.z;
}`;
