/*
 ********************************
 ********** Basic Setup *********
 ********************************
 */
import * as THREE from "three";

import { vertShaderCube } from "./vertShaderCube.vert.js";
import { fragShaderCube } from "./fragShaderCube.frag.js";

// defining the variables
let camera, scene, renderer, directionalLight, ambientLight;
var uniforms;

function init() {
  // +++ create a WebGLRenderer +++
  // enables antialiasing (nicer geometry: borders without stair effect)
  renderer = new THREE.WebGLRenderer({ antialias: true });

  // get and set window dimension for the renderer
  renderer.setSize(window.innerWidth, window.innerHeight);

  // add dom object(renderer) to the body section of the index.html
  document.body.appendChild(renderer.domElement);

  camera = new THREE.Camera();
  camera.position.z = 1;
  scene = new THREE.Scene();
  var geometry = new THREE.PlaneGeometry(2, 2);

  uniforms = {
    //u_time: { type: "f", value: 1.0 },
    u_resolution: { type: "v2", value: new THREE.Vector2() },
    u_mouse: { type: "v2", value: new THREE.Vector2() },
    iGlobalTime: { type: "f", value: 1.0 },
    iResolution: { type: "v3", value: new THREE.Vector3() },
    zoom: { value: 0.001 },
    rotation: { value: 0 },
    fixedPoint: { value: true },
    focus : {type: "v3", value: new THREE.Vector3(-1.48, 0.0)},
    //focus: { type: "v3", value: new THREE.Vector3(0.0, 0.0) },
    //focus : {type: "v3", value: new THREE.Vector3(0.0, 0.0)}
    colormap : { type: "v3v", value: [ new THREE.Vector3( 0.1, 0.2, 0.3), new THREE.Vector3( 0.4, 0.5, 0.6) ] }
  };

  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertShaderCube,
    fragmentShader: fragShaderCube,
  });

  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer.setPixelRatio(window.devicePixelRatio);
  onWindowResize();
  window.addEventListener('resize', onWindowResize, false);
  document.onmousemove = function (e) {
    uniforms.u_mouse.value.x = e.pageX
    uniforms.u_mouse.value.y = e.pageY
  }
  document.addEventListener('wheel', function (e) {
    moveView(e, e.clientX, e.clientY)
    var vz = e.deltaY > 0 ? -1.0 : 1.0
    uniforms.zoom.value += vz * 0.1
    document.getElementById("label").innerHTML = Math.exp(-uniforms.zoom.value)
  });
  document.addEventListener('keydown', function (e) {
    
    switch (e.key) {
      case 'w':
        moveView2(e, 0, 2)
        break;
  
      case 'a':
        moveView2(e, 2, 0)
        break;
  
      case 's':
        moveView2(e, 0, -2)
        break;
  
      case 'd':
        moveView2(e, -2 , 0)
        break;
  
      default:
        break;
    }
  });

  var checkbox = document.getElementById("scales")
  checkbox.addEventListener('change', () => {
    uniforms.fixedPoint.value = !checkbox.checked
  })

  document.addEventListener('mousedown', mouseDown, false);
  window.addEventListener('mouseup', mouseUp, false);
}

function mouseUp() {
  window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e) {
  window.addEventListener('mousemove', divMove, true);
}

function divMove(e) {
  moveView2(e, e.movementX, e.movementY)
}

function moveView(e, x, y) {
  var rect = e.target.getBoundingClientRect();
  var x = x - rect.left - (rect.width / 2.0); //x position within the element.
  var y = (rect.height / 2.0) - y - rect.top;  //y position within the element.
  console.log(x, y)
  var vz = e.deltaY > 0 ? -1.0 : 1.0
  uniforms.focus.value.x += ((x / (rect.width / 2.0)) / (5.0 * Math.exp(uniforms.zoom.value)))
  uniforms.focus.value.y += ((y / (rect.width / 2.0)) / (5.0 * Math.exp(uniforms.zoom.value)))
}

function moveView2(e, x, y) {
  uniforms.focus.value.x -= (x / (450.0 * Math.exp(uniforms.zoom.value)))
  uniforms.focus.value.y += (y / (450.0 * Math.exp(uniforms.zoom.value)))
}

function onWindowResize(event) {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.x = renderer.domElement.width;
  uniforms.u_resolution.value.y = renderer.domElement.height;
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
}

// animation function calling the renderer
function animate() {
  requestAnimationFrame(animate);
  render();
}

init();
animate();
