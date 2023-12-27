import * as THREE from 'three'
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'


let camera, scene, renderer;
let controller;
let raycaster, cursor, tags = [];
let box, bathroom;

init();
animate();

function init() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

  // loading bathroom object
  const loader = new OBJLoader();
  loader
    .load(
      // resource URL
      'bathroom.obj',
      // called when resource is loaded
      function (object) {
        // object.rotateZ(Math.PI);
        bathroom = object
        object.scale.set(0.001, 0.001, 0.001);
        scene.add(object);
      },
      // called when loading is in progresses
      function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      // called when loading has errors
      function (error) {
        console.log('An error happened');
      }
    );

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 3);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);

  // Create a box geometry and material
  const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5); // Size of the box
  const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00, side: THREE.DoubleSide }); // Green color
  box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.set(0, 0.1, -2);
  scene.add(box);

  // Create the raycaster
  raycaster = new THREE.Raycaster();
  // Initialize the plane with the image texture
  const planeGeometry = new THREE.PlaneGeometry(0.2, 0.2); // Adjust size as needed
  const texture = new THREE.TextureLoader().load('my-image.png');
  const planeMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
  cursor = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(cursor);
  cursor.visible = false; // Initially hide the plane
  //

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  document.body.appendChild(ARButton.createButton(renderer));

  function onSelect() {
    tags.push(cursor);
    cursor = null;
  }

  controller = renderer.xr.getController(0);
  controller.addEventListener('select', onSelect);
  scene.add(controller);

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

//

function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  renderer.render(scene, camera);
  updateRaycaster();
}

function updateRaycaster() {
  // Update the raycaster to match the camera direction
  raycaster.setFromCamera({ x: 0, y: 0 }, camera);

  // Check for intersections with the box
  const intersects = raycaster.intersectObjects([box, bathroom]);

  if (intersects.length > 0) {
    const closestIntersection = intersects[0]; // Assuming closest intersection is what we want
    const offsetPoint = closestIntersection.point.add(closestIntersection.face.normal.multiplyScalar(0.001)); // Add a small offset
    // Adjust the plane's orientation and position
    cursor.position.copy(offsetPoint);
    cursor.lookAt(closestIntersection.face.normal.add(closestIntersection.point));
    cursor.visible = true; // Make the plane visible
  } else {
    cursor.visible = false; // Hide the plane if no intersection
  }
}