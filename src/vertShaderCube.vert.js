//language=GLSL
export const vertShaderCube = `

out vec3 fragCoord;
uniform vec3 boxLength;
uniform float zoom;
out vec3 localposVertex;


void main() {
    fragCoord = ((position + boxLength / 2.0) / boxLength);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
