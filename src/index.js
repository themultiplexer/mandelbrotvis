/*
 ********************************
 ********** Basic Setup *********
 ********************************
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper";

//load shaders
// cube
import { vertShaderCube } from "./vertShaderCube.vert.js";
import { fragShaderCube } from "./fragShaderCube.frag.js";

// defining the variables
let camera, scene, renderer, directionalLight, ambientLight;
let materialCube,
  materialSpherePerVertex,
  materialSpherePerPixel,
  baseColorSpherePerVertex,
  baseColorSpherePerPixel;
let radiusSpherePerVertex,
  widthSegmentsSpherePerVertex,
  heightSegmentsSpherePerVertex,
  radiusSpherePerPixel,
  widthSegmentsSpherePerPixel,
  heightSegmentsSpherePerPixel;
let meshSpherePerVertex, meshSpherePerPixel;

let mesh;

function init() {
  // +++ create a WebGLRenderer +++
  // enables antialiasing (nicer geometry: borders without stair effect)
  renderer = new THREE.WebGLRenderer({ antialias: true });

  // get and set window dimension for the renderer
  renderer.setSize(window.innerWidth, window.innerHeight);

  // add dom object(renderer) to the body section of the index.html
  document.body.appendChild(renderer.domElement);

  //creating the Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // adding directional light
  directionalLight = new THREE.DirectionalLight("#efebd8", 1.1);
  scene.add(directionalLight);

  // adding ambient light
  ambientLight = new THREE.AmbientLight("#efebd8", 0.2);
  scene.add(ambientLight);

  // adding a camera PerspectiveCamera( fov, aspect, near, far)
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    10
  );

  // set the camera position x,y,z in the Scene
  camera.position.set(0, 0, 1);

  // add controls to the scene
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  // create cube geomerty
  let center = new THREE.Vector3(0.0, 0.0, -1.0);
  const geometry = new THREE.PlaneGeometry( 2, 1 );

  // cube uniforms
  let uniforms = {
    boxLength: {
      value: new THREE.Vector3(1, 1, 1),
    },
    iGlobalTime: { type: "f", value: 1.0 },
    iResolution: { type: "v3", value: new THREE.Vector3() },
    zoom: { value: 0.1 },
  };
  // cube material
  materialCube = new THREE.ShaderMaterial({
    vertexShader: vertShaderCube,
    fragmentShader: fragShaderCube,
    uniforms: uniforms,
    glslVersion: THREE.GLSL3,
  });

  // cube object
  mesh = new THREE.Mesh(geometry, materialCube);
  mesh.position.copy(center);
  scene.add(mesh);

  uniforms.iResolution.value.x = 50;
  uniforms.iResolution.value.y = 50;
}

/*
 ********************************
 *** Animation and Rendering ****
 ********************************
 */

// extendable render wrapper
function render() {
  renderer.render(scene, camera);
  if (mesh.position.z < 1) {
    mesh.position.z += 0.01;
  } else {
    mesh.position.z = -1.0;
  }
  
  //materialCube.uniforms.zoom.value += 0.01;
}

// animation function calling the renderer
function animate() {
  requestAnimationFrame(animate);
  render();
}

init();
animate();
