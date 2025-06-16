// Lights

import * as THREE from "three";
import { FontLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import * as lil_gui from "lil-gui";
import { RectAreaLightHelper } from "three/examples/jsm/Addons.js";

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
const gui = new lil_gui.GUI({ closed: true, width: 400 });

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

// LIGHTS
// 1. Ambient Light : omni-directional, omni-present
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);

// 2. Directional Light : Parallel light rays from one particular direction
const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.6);

// 3. Hemisphere light : similar to ambient light but 2 different colors for up and down (opposite) directions
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 3);
hemisphereLight.position.set(0, 0, 1.5); // positing it differently somehow changes its rotation

// 4. Point light : point light source, can be place according to lighting needs, decays with distance
const pointLight = new THREE.PointLight(0xFFD700, 5, 10, 2);
pointLight.position.set(1, -0.4, 2);

// 5. RectArea light
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 40, 1.5, 1.5)
rectAreaLight.position.set(3, -0.5, 1)
rectAreaLight.rotation.set(0, Math.PI/4, 0)

// 6. Spot light
const spotlight = new THREE.SpotLight(
	0x78ff00,
	5,
	10, // light will fade after this distance
	Math.PI / 12, // angle, in this case it is 15 degrees
	0.1, // penumbra, this is used to create a soft edge
	1 // decay
);
spotlight.position.set(-1, 2, 4);
spotlight.target.position.set(-2, 0, 0);
scene.add(spotlight.target);
// The target property is used to make the light look at a specific point in space.
// In order to make this work, we need to add the target to the scene.
// Because the target property is not a Vector3.
// spotlight helper can't be added to the scene before light.target and light are added (some internal working reason)

scene.add(
    ambientLight,
    directionalLight,
    hemisphereLight,
    pointLight,
    rectAreaLight,
    spotlight
);

// LIGHT HELPERS : Helps place markers at the origin of a light source
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.3);
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.1);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.1);
const spotLightHelper = new THREE.SpotLightHelper(spotlight)
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)  // different import is used to import this helper

scene.add(directionalLightHelper, pointLightHelper, hemisphereLightHelper, spotLightHelper, rectAreaLightHelper);

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.6;
material.roughness = 0.2;
// material.color.set(0x84acf5)
// material.map = matcapTx

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.position.x = -2;
scene.add(sphere);

const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 100), material);
scene.add(cube);

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.2, 64, 128), material);
torus.position.x = 2;
scene.add(torus);

const planeGround = new THREE.Mesh(new THREE.PlaneGeometry(8, 8, 100, 100), material);
planeGround.position.y = -1;
planeGround.rotation.x = 3*Math.PI / 2;
scene.add(planeGround);

const planeBack = new THREE.Mesh(new THREE.PlaneGeometry(8, 8, 100, 100), material);
planeBack.position.z = -4;
scene.add(planeBack);

const planeLeft = new THREE.Mesh(new THREE.PlaneGeometry(8, 8, 100, 100), material);
planeLeft.position.x = -4;
planeLeft.rotation.y = Math.PI / 2;
scene.add(planeLeft);

const planeRight = new THREE.Mesh(new THREE.PlaneGeometry(8, 8, 100, 100), material);
planeRight.position.x = 4;
planeRight.rotation.y = 3*Math.PI / 2;
scene.add(planeRight);

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
scene.add(camera);
camera.position.z = 4;
// camera.position.x = -1;
camera.position.y = 2;

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
    const elapsedTime = clock.getElapsedTime();

    sphere.rotation.x = -elapsedTime * 0.1;
    cube.rotation.x = elapsedTime * 0.2;
    torus.rotation.x = elapsedTime * 0.1;
    sphere.rotation.y = elapsedTime * 0.2;
    cube.rotation.y = -elapsedTime * 0.1;
    torus.rotation.y = elapsedTime * 0.2;

    camera.lookAt(0, 0, 0);
    controls.update(); // for damping
    window.requestAnimationFrame(tick2);
    renderer.render(scene, camera);
};
tick2();

//////////////////// SHOW /////////////////////
// Lights

// import * as THREE from "three";
// import {
//     FontLoader,
//     OrbitControls,
//     TextGeometry,
//     RectAreaLightHelper,
// } from "three/examples/jsm/Addons.js";
// import * as lil_gui from "lil-gui";

// const sizes = {
//     width: window.innerWidth,
//     height: window.innerHeight,
// };

// const canvas = document.querySelector("canvas.webgl");
// const scene = new THREE.Scene();

// const fontLoader = new FontLoader();

// // LIGHTS
// const lights = {
//     "Ambient Light": {
//         light: new THREE.AmbientLight(0xffffff, 0.1),
//     },
//     "Directional Light": {
//         light: new THREE.DirectionalLight(0x00ffff, 0.6),
//     },
//     "Hemisphere Light": {
//         light: new THREE.HemisphereLight(0xff0000, 0x0000ff, 3),
//         position: { x: 0, y: 0, z: 1.5 },
//     },
//     "Point Light": {
//         light: new THREE.PointLight(0xffd700, 5, 10, 2),
//         position: { x: 1, y: -0.4, z: 2 },
//     },
//     "RectArea Light": {
//         light: new THREE.RectAreaLight(0x4e00ff, 40, 1.5, 1.5),
//         position: { x: 3, y: -0.5, z: 1 },
//         rotation: { x: 0, y: Math.PI / 4, z: 0 },
//     },
//     "Spot light": {
//         light: new THREE.SpotLight(0x78ff00, 5, 10, Math.PI / 12, 0.1, 1),
//         position: { x: -2, y: 2, z: 3 },
//         target: { x: -2, y: 0, z: 0 },
//     },
// };

// for (const key in lights) {
//     const entry = lights[key];
//     const light = entry.light;

//     if (light.isDirectionalLight) {
//         entry.helper = new THREE.DirectionalLightHelper(light, 0.3);
//     } else if (light.isHemisphereLight) {
//         entry.helper = new THREE.HemisphereLightHelper(light, 0.3);
//     } else if (light.isPointLight) {
//         entry.helper = new THREE.PointLightHelper(light, 0.3);
//     } else if (light.isRectAreaLight) {
//         entry.helper = new RectAreaLightHelper(light);
//     }
// }

// // progressivelyAddLights(scene, lights, 1000);
// fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
//     createTextMeshes(scene, font, "Himanshu in three.js");
//     progressivelyAddLights(scene, lights, font);
// });


// function progressivelyAddLights(scene, lights, font, interval = 2500) {
//     const lightEntries = Object.entries(lights);
//     let index = 0;
//     const helpers = [];

//     const intervalId = setInterval(() => {
//         if (index >= lightEntries.length) {
//             clearInterval(intervalId);
//             return;
//         }

//         const [name, { light, position, rotation, helper, target }] = lightEntries[index];

//         createTextMeshes(scene, font, name);

//         if (position) {
//             if (light.isSpotLight) {
//                 light.target.position.set(target.x, target.y, target.z);
//                 light.position.set(position.x, position.y, position.z);
//             } else light.position.set(position.x, position.y, position.z);
//         }
//         if (rotation) light.rotation.set(rotation.x, rotation.y, rotation.z);

//         if (helper) helpers.push(helper);

//         scene.add(light);

//         if (light.isSpotLight) {
//             scene.add(light.target);
//             const thisHelper = new THREE.SpotLightHelper(light);
//             helpers.push(thisHelper);
//         }

//         console.log(`Added light: ${name}`);
//         index++;
//     }, interval);

//     setTimeout(() => {
//         helpers.forEach((item) => scene.add(item));
//         createTextMeshes(scene, font, "Light Helpers");
//     }, (lightEntries.length+1) * interval);

//     setTimeout(() => {
//         helpers.forEach((item) => scene.remove(item));
//         createTextMeshes(scene, font, "Lights in three.js");
//     }, (lightEntries.length+2) * interval);
// }


// let textMeshes = [];

// function createTextMeshes(scene, font, title) {
//     // Remove old text meshes from scene
//     textMeshes.forEach(mesh => scene.remove(mesh));
//     textMeshes = [];

//     const textGeometry = new TextGeometry(title, {
//         font: font,
//         size: 0.4,
//         height: 0.2,
//         curveSegments: 6,
//         bevelEnabled: true,
//         bevelThickness: 0.03,
//         bevelSize: 0.02,
//         bevelOffset: 0,
//         bevelSegments: 5,
//         depth: 0.1,
//     });
//     textGeometry.center();

//     const material2 = new THREE.MeshStandardMaterial({
//         metalness: 0.9,
//         roughness: 0.4
//     });

//     const text1 = new THREE.Mesh(textGeometry, material2);
//     const text2 = new THREE.Mesh(textGeometry.clone(), material2);
//     const text3 = new THREE.Mesh(textGeometry.clone(), material2);

//     text1.position.set(0, 1, -4);
//     text2.position.set(-4, 1, 0);
//     text2.rotation.y = Math.PI / 2;
//     text3.position.set(4, 1, 0);
//     text3.rotation.y = (3 * Math.PI) / 2;

//     textMeshes.push(text1, text2, text3);
//     scene.add(text1, text2, text3);
// }

// const material = new THREE.MeshStandardMaterial();
// material.metalness = 0.6;
// material.roughness = 0.2;

// const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
// sphere.position.x = -2;
// scene.add(sphere);

// const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 100), material);
// scene.add(cube);

// const torus = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.2, 64, 128), material);
// torus.position.x = 2;
// scene.add(torus);

// const planeGround = new THREE.Mesh(new THREE.PlaneGeometry(8, 8, 100, 100), material);
// planeGround.position.y = -1;
// planeGround.rotation.x = (3 * Math.PI) / 2;
// scene.add(planeGround);

// const planeBack = new THREE.Mesh(new THREE.PlaneGeometry(8, 8, 100, 100), material);
// planeBack.position.z = -4;
// scene.add(planeBack);

// const planeLeft = new THREE.Mesh(new THREE.PlaneGeometry(8, 8, 100, 100), material);
// planeLeft.position.x = -4;
// planeLeft.rotation.y = Math.PI / 2;
// scene.add(planeLeft);

// const planeRight = new THREE.Mesh(new THREE.PlaneGeometry(8, 8, 100, 100), material);
// planeRight.position.x = 4;
// planeRight.rotation.y = (3 * Math.PI) / 2;
// scene.add(planeRight);

// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
// scene.add(camera);
// // camera.position.z = 4;
// // camera.position.x = -1;
// // camera.position.y = 1;

// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// // controls.enableZoom = false;

// const renderer = new THREE.WebGLRenderer({ canvas: canvas });
// renderer.setSize(sizes.width, sizes.height);
// renderer.render(scene, camera);

// window.addEventListener("resize", () => {
//     sizes.width = window.innerWidth;
//     sizes.height = window.innerHeight;

//     camera.aspect = sizes.width / sizes.height;
//     camera.updateProjectionMatrix();

//     renderer.setSize(sizes.width, sizes.height);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// });

// window.addEventListener("dblclick", () => {
//     const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
//     if (!fullscreenElement) {
//         if (canvas.requestFullscreen) canvas.requestFullscreen();
//         else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
//     } else {
//         if (document.exitFullscreen) document.exitFullscreen();
//         else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
//     }
// });

// const clock = new THREE.Clock();
// const speed = 0.7; const radius = 4.2
// const tick2 = () => {
//     const elapsedTime = clock.getElapsedTime();

//     sphere.rotation.x = -elapsedTime * 0.1;
//     cube.rotation.x = elapsedTime * 0.2;
//     torus.rotation.x = elapsedTime * 0.1;
//     sphere.rotation.y = elapsedTime * 0.2;
//     cube.rotation.y = -elapsedTime * 0.1;
//     torus.rotation.y = elapsedTime * 0.2;

//     camera.position.x = radius * Math.cos(elapsedTime * speed);
//     camera.position.z = radius * Math.sin(elapsedTime * speed);
//     camera.position.y = 3;

//     camera.lookAt(0,0,0);
//     controls.update(); // for damping
//     renderer.render(scene, camera);
//     window.requestAnimationFrame(tick2);
// };
// tick2();
