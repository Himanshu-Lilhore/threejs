// Geometries

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const sizes = {
    width: window.innerWidth, //1100,
    height: window.innerHeight,
};

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);  // here 2s represent number/level of triangle we want on each face (number of triangle increase exponentially with respect to this parameter)
const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    // wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
mesh.position.x = -2;

// CUSTOM GEOMETRIES :
// 1. simple triangle
const positionsArray = new Float32Array([
    0, 0, 0,
    0, 1, 0,
    1, 0, 0
])
// Float32Array is a vanilla js concept
// we use Float32Array to store the coordinates in 3d space
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)  // 3 here represents take sets of 3 from the array for each coordinate
const geometry2 = new THREE.BufferGeometry()
geometry2.setAttribute('position', positionsAttribute)
const material2 = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide
});
const mesh2 = new THREE.Mesh(geometry2, material2)

// 2. random mess
const triangleCount = 50
const positionsArray3 = new Float32Array(triangleCount * 3*3)
for(let i = 0; i<triangleCount * 3 * 3; i++) {
    positionsArray3[i] =(Math.random() -0.5)*15
}
const positionsAttribute3 = new THREE.BufferAttribute(positionsArray3, 3)
const geometry3 = new THREE.BufferGeometry()  // as the name say, buffer geometry (intermediate geometry state)
geometry3.setAttribute('position', positionsAttribute3)
const material3 = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    wireframe: true,
});
const mesh3 = new THREE.Mesh(geometry3, material3)

const group = new THREE.Group()
group.add(mesh)
group.add(mesh2)
group.add(mesh3)
scene.add(group)

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
scene.add(camera);
camera.position.z = 4;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fullscreenElement) {
        if (canvas.requestFullscreen) canvas.requestFullscreen();
        else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
});

const clock = new THREE.Clock();
const tick2 = () => {
    const elapsedTime = clock.getElapsedTime();
    camera.position.y = Math.sin(elapsedTime);
    camera.position.x = Math.tan(elapsedTime);
    camera.position.z = 3*Math.cos(elapsedTime);
    camera.lookAt(-1,0,0)
    controls.update(); // for damping
    window.requestAnimationFrame(tick2);
    renderer.render(scene, camera);
};
tick2();
