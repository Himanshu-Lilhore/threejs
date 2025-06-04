// full screen

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const sizes = {
    width: window.innerWidth, //1100,
    height: window.innerHeight,
};

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
scene.add(camera);
camera.position.z = 3;

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
    camera.updateProjectionMatrix(); // threejs handles this internally

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // this needs to be capped off to limit rendering more pixels on device with high pixel ratios
});

// DOUBLE CLICK TO FULL SCREEN (Esc to exit)
// this won't work on safari bcz it is a chutiya browser (as of 2019), the version below this accomodates that
// window.addEventListener("dblclick", () => {
//     if (!document.fullscreenElement()) canvas.requestFullscreen();
//     else document.exitFullscreen(); 
// });

window.addEventListener("dblclick", () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    if (!fullscreenElement) {
        if(canvas.requestFullscreen) canvas.requestFullscreen();
        else if(canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
    } else {
        if(document.exitFullscreen) document.exitFullscreen();
        else if(document.webkitExitFullscreen) document.webkitExitFullscreen();
    };
});



const clock = new THREE.Clock();
const tick2 = () => {
    const elapsedTime = clock.getElapsedTime();
    controls.update(); // for damping
    window.requestAnimationFrame(tick2);
    renderer.render(scene, camera);
};
tick2();
