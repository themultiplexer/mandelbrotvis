/*
 ********************************
 ********** Basic Setup *********
 ********************************
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

//load shaders
import { vertShaderCube } from "./vertShaderCube.vert.js";
import { fragShaderCube } from "./fragShaderCube.frag.js";

// defining the variables
let camera, scene, renderer, directionalLight, ambientLight;
let materials = []
let meshes = []

const NUM_PLANES = 100
const PLANE_DIST = 0.2
const ZOOM_DIFF = 0.1
const ROTATION_DIFF = 0.1

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
  scene.background = new THREE.Color(0x000000);

  // adding directional light
  directionalLight = new THREE.DirectionalLight("#efebd8", 1.1);
  scene.add(directionalLight);

  // adding ambient light
  ambientLight = new THREE.AmbientLight("#efebd8", 0.2);
  scene.add(ambientLight);

  // adding a camera PerspectiveCamera( fov, aspect, near, far)
  camera = new THREE.PerspectiveCamera(
    50,
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
  const geometry = new THREE.PlaneGeometry(80, 40);

  for (let index = 0; index < NUM_PLANES; index++) {
    // cube uniforms
    let uniforms = {
      boxLength: {
        value: new THREE.Vector3(1, 1, 1),
      },
      iGlobalTime: { type: "f", value: 1.0 },
      iResolution: { type: "v3", value: new THREE.Vector3() },
      zoom: { value: (ZOOM_DIFF * index) },
      rotation: { value: ROTATION_DIFF * index },
      //focus : {type: "v3", value: new THREE.Vector3(-1.48, 0.0)}
      //focus : {type: "v3", value: new THREE.Vector3(-1.9, 0.0)}
      focus : {type: "v3", value: new THREE.Vector3(-1.99999999999, 0.0)}
    };
    // cube material
    let material = new THREE.ShaderMaterial({
      vertexShader: vertShaderCube,
      fragmentShader: fragShaderCube,
      uniforms: uniforms,
      glslVersion: THREE.GLSL3,
      transparent: true,
    });

    materials.push(material)

    // cube object
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(new THREE.Vector3(0.0, 0.0, -(index * PLANE_DIST)));
    meshes.push(mesh)
    scene.add(mesh);
  }
}

/*
 ********************************
 *** Animation and Rendering ****
 ********************************
 */

let zoom = 0

// extendable render wrapper
function render() {
  renderer.render(scene, camera);

  for (let index = 0; index < NUM_PLANES; index++) {
    if (meshes[index].position.z < 1) {
      meshes[index].position.z += 0.005;
    } else {
      meshes[index].position.z = -(NUM_PLANES - 1) * PLANE_DIST + 1;
      materials[index].uniforms.zoom.value += (ZOOM_DIFF * (NUM_PLANES - 1));
      materials[index].uniforms.rotation.value += ROTATION_DIFF;
    }
  }
  zoom += (ZOOM_DIFF * (NUM_PLANES - 1));
  document.getElementById("zoom").innerHTML = zoom
}

// animation function calling the renderer
function animate() {
  requestAnimationFrame(animate);
  render();
}

init();
animate();
