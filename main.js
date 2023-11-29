import * as THREE from 'three'
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

let camera, scene, renderer;
let controller;
let raycaster, intersectedPoint;


init();
animate();

function init() {

  const container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 3);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);

  // Create a box geometry and material
  const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5); // Size of the box
  const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // Green color

  // Create a mesh with the geometry and material
  const box = new THREE.Mesh(boxGeometry, boxMaterial);

  // Position the box (you can change x, y, z as needed)
  box.position.set(0, 0.1, -1);

  // Add the box to the scene
  scene.add(box);

  // Create the raycaster
  raycaster = new THREE.Raycaster();


  //

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  //

  document.body.appendChild(ARButton.createButton(renderer));

  //

  const geometry = new THREE.CylinderGeometry(0, 0.05, 0.2, 32).rotateX(Math.PI / 2);





  function onSelect() {

    const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random() });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -1).applyMatrix4(controller.matrixWorld);
    mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
    scene.add(mesh);

  }

  controller = renderer.xr.getController(0);
  controller.addEventListener('select', onSelect);
  scene.add(controller);

  //

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
  const intersects = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.geometry.type === 'BoxGeometry') {
      // Found an intersection with the box
      if (!intersectedPoint) {
        // Create a sphere if it doesn't exist yet
        const sphereGeometry = new THREE.SphereGeometry(0.05, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        intersectedPoint = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(intersectedPoint);
      }
      // Position the sphere at the intersection point
      intersectedPoint.position.copy(intersects[i].point);

      break;
    }
  }


}