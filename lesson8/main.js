// Debug UI (lil gui)

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as lil_gui from "lil-gui";
import gsap from "gsap";

const sizes = {
    width: window.innerWidth, //1100,
    height: window.innerHeight,
};
const gui = new lil_gui.GUI({ closed: true, width: 400 });

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    // wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
mesh.position.x = -2;

const triangleCount = 50;
const positionsArray3 = new Float32Array(triangleCount * 3 * 3);
for (let i = 0; i < triangleCount * 3 * 3; i++) {
    positionsArray3[i] = (Math.random() - 0.5) * 15;
}
const positionsAttribute3 = new THREE.BufferAttribute(positionsArray3, 3);
const geometry3 = new THREE.BufferGeometry(); // as the name say, buffer geometry (intermediate geometry state)
geometry3.setAttribute("position", positionsAttribute3);
const material3 = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    wireframe: true,
});
const mesh3 = new THREE.Mesh(geometry3, material3);

const group = new THREE.Group();
group.add(mesh);
group.add(mesh3);
scene.add(group);

const parameters = {
    color: "#ff0000",
    spin: () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
    },
    spinChaos: () => {
        gsap.to(mesh3.rotation, { duration: 3, x: mesh3.rotation.x + Math.PI, y: mesh3.rotation.y + Math.PI });
    },
};

// GUI panel
gui.add(parameters, "spinChaos").name("Chaos:Spin");
gui.add(mesh.position, "y").min(-5).max(5).step(0.01).name("RedBox:Y");
gui.add(mesh.position, "x").min(-5).max(5).step(0.01).name("RedBox:X");
gui.add(mesh, "visible").name("RedBox:Visibility");
gui.add(mesh.material, "wireframe").name("RedBox:wireframe");
gui.addColor(parameters, "color")
    .onChange(() => material.color.set(parameters.color))
    .name("BoxColor");
gui.add(parameters, "spin").name("Box:Spin");

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
    camera.lookAt(-1, 0, 0);
    controls.update(); // for damping
    window.requestAnimationFrame(tick2);
    renderer.render(scene, camera);
};
tick2();
