// 3D texts

import * as THREE from "three";
import { FontLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import * as lil_gui from "lil-gui";
import gsap from "gsap";
import { TextGeometry } from "three/examples/jsm/Addons.js";

const sizes = {
    width: window.innerWidth, //1100,
    height: window.innerHeight,
};
const gui = new lil_gui.GUI({ closed: true, width: 400 });

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

// textures
const loadingManager = new THREE.LoadingManager();

const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load("/textures/door/color.jpg");

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({
    // color: 0xff0000,
    map: colorTexture,
});
const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// 3D text
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
const matcapTexture2 = textureLoader.load("/textures/matcaps/1.png");

const material2 = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
    const textGeometry = new TextGeometry("Himanshu in three.js", {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 6,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
        depth: 0.2
    });
    /* to center the text */
    // textGeometry.computeBoundingBox();
    // textGeometry.translate(
    // 	-(textGeometry.boundingBox!.max.x - 0.02) * 0.5,
    // 	-(textGeometry.boundingBox!.max.y - 0.02) * 0.5,
    // 	-(textGeometry.boundingBox!.max.y - 0.02) * 0.5
    // );
    textGeometry.center();

    const text = new THREE.Mesh(textGeometry, material2);
    scene.add(text);
});

/**
 * create geometry and material for donuts before loop for performance optimization
 */
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture2 });
for (let i = 0; i < 500; i++) {
    const donut = new THREE.Mesh(donutGeometry, donutMaterial);

    donut.position.x = (Math.random() - 0.5) * 14;
    donut.position.y = (Math.random() - 0.5) * 14;
    donut.position.z = (Math.random() - 0.5) * 14;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    // donut.scale.x = scale;
    // donut.scale.y = scale;
    // donut.scale.z = scale;
    donut.scale.set(scale, scale, scale);

    scene.add(donut);
}

// GUI panel
const parameters = {
    color: "#ff0000",
    spin: () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
    },
};
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
// camera.position.x = -1;
// camera.position.y = 1;

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
const radius = 3.5;    // how far from the center
const speed  = 0.7;
const tick2 = () => {
    const elapsedTime = clock.getElapsedTime();
    camera.lookAt(0, 0, 0);
     const t = clock.getElapsedTime() * speed;
    camera.position.x = Math.cos(t) * radius;
  camera.position.z = Math.sin(t) * radius;
    mesh.rotation.y = elapsedTime;
    controls.update(); // for damping
    window.requestAnimationFrame(tick2);
    renderer.render(scene, camera);
};
tick2();
