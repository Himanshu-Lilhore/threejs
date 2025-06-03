// Cameras, OrbitControls, 

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const sizes = {
    width: 1300, //1100,
    height: 750,
};
const cursor = {
    x: 0,
    y: 0,
};

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// perspective camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100); // 3rd param - least distance it will see, 4th - farthest
// scene.add(camera);

// orthographic camera
const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100);
camera.position.z = 3;

// manual attempt at orbit controls
// window.addEventListener("mousemove", (event) => {
//     cursor.x = event.clientX / sizes.width - 0.5;
//     cursor.y = event.clientY / sizes.height - 0.5;
// });

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const clock = new THREE.Clock();
const tick2 = () => {
    const elapsedTime = clock.getElapsedTime();
    // camera.position.x = cursor.x*3
    // camera.position.y = -cursor.y*3
    // camera.lookAt(mesh.position)
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    // camera.position.y = cursor.y * 5;
    // mesh.rotation.y = elapsedTime;
    // mesh.rotation.x = elapsedTime;
    controls.update()  // for damping
    window.requestAnimationFrame(tick2);
    renderer.render(scene, camera);
};
tick2();
