// Galaxy generator
const localStorageVariable = "galaxySettings"

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as lil_gui from "lil-gui";

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
const gui = new lil_gui.GUI({ closed: true, width: 400 });
// gui.domElement.style.display = 'none';

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/3.png");



const parameters = {
    "count": 29700,
    "branches": 5,
    "radius": 3,
    "curve": 0.74,
    "order": 3.8,
    "flatness": 1.7,
    "flatEnds": 0.22,
    "innerColor": "#ff8800",
    "outerColor": "#0000ff"
};

const savedSettings = JSON.parse(localStorage.getItem(localStorageVariable));
if (savedSettings) {
    console.log(`Parameters from localStorage (${localStorageVariable}) : `, savedSettings)
    Object.assign(parameters, savedSettings);
}


let geometry = null;
let material = null;
let points = null;

// scene.add(new THREE.AxesHelper())


const generateGalaxy = () => {
    if (points !== null) {
        geometry?.dispose(); // disposes the geometry from the memory
        material?.dispose(); // Disposes the material from the memory
        scene.remove(points); // removes the points from the scene
    }

    geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const innerColor = new THREE.Color(parameters.innerColor);
    const outerColor = new THREE.Color(parameters.outerColor);

    for (let i = 0; i < parameters.count * 3; i += 3) {
        // position
        const branchAngle =
            2 *
            Math.PI *
            ((parameters.branches - ((i / 3) % parameters.branches)) / parameters.branches);

        const localRadius = parameters.radius * Math.random();

        const xRand = ((Math.random() - 0.5) / parameters.order) * (parameters.radius - localRadius + parameters.flatEnds);
        const zRand = ((Math.random() - 0.5) / parameters.order) * (parameters.radius - localRadius + parameters.flatEnds);
        positions[i + 0] =
            localRadius * Math.sin(branchAngle + localRadius / parameters.curve) + xRand; //x
        positions[i + 1] = ((Math.random() - 0.5) / parameters.flatness) * (parameters.radius - localRadius); //y
        positions[i + 2] =
            localRadius * Math.cos(branchAngle + localRadius / parameters.curve) + zRand; //z

        // color
        const mixedColor = innerColor.clone();
        mixedColor.lerp(outerColor, localRadius / parameters.radius);
        colors[i + 0] = mixedColor.r;
        colors[i + 1] = mixedColor.g;
        colors[i + 2] = mixedColor.b;
        // colors[i] = Math.random()
        // colors[i+1] = Math.random()
        // colors[i+2] = Math.random()
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    material = new THREE.PointsMaterial({
        size: 0.03,
        sizeAttenuation: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        alphaMap: particleTexture,
        transparent: true,
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);
};
generateGalaxy();

gui.add(parameters, "count").min(100).max(100000).step(100).onFinishChange(generateGalaxy);
gui.add(parameters, "branches").min(1).max(25).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, "radius").min(1).max(25).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, "curve").name("anti-curve").min(0.001).max(3).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, "flatness").min(0.1).max(10).step(0.1).onFinishChange(generateGalaxy);
gui.add(parameters, "order").min(1).max(25).step(0.1).onFinishChange(generateGalaxy);
gui.add(parameters, "flatEnds").min(0).max(1).step(0.01).onFinishChange(generateGalaxy);
gui.addColor(parameters, "innerColor").onFinishChange(generateGalaxy);
gui.addColor(parameters, "outerColor").onFinishChange(generateGalaxy);
gui.onFinishChange(() => {
    localStorage.setItem(localStorageVariable, JSON.stringify(parameters));
});
gui.onFinishChange(() => {
    localStorage.setItem(localStorageVariable, JSON.stringify(parameters));
});
parameters.copyToClipboard = () => {
    const copyParams = { ...parameters };
    delete copyParams.copyToClipboard;

    const code = `const parameters = ${JSON.stringify(copyParams, null, 4)};`;
    navigator.clipboard.writeText(code).then(() => {
        console.log("Parameters copied to clipboard");
    });
};
gui.add(parameters, "copyToClipboard").name("📋 Copy Config");



const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 100);
scene.add(camera);
camera.position.z = 3;
camera.position.y = 2;

// const fog = new THREE.Fog("#000000", 1, 10);
// scene.fog = fog;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.enableZoom = false;

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
    const elapsedTime = clock.getElapsedTime() * 0.7;

    camera.position.z = Math.sin(elapsedTime/2)
    camera.position.x = -Math.cos(elapsedTime/2)

    camera.lookAt(0, 0, 0);
    controls.update(); // for damping
    window.requestAnimationFrame(tick2);
    renderer.render(scene, camera);
};
tick2();
