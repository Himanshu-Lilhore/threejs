// Cameras

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const sizes = {
    width: 1300, //1100,
    height: 750,
};

const loader = new GLTFLoader();
const modelRoot = new THREE.Group();

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
scene.add(modelRoot);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

scene.add(new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 1.1));
const light = new THREE.PointLight(0xffffff, 1000, 300);
light.position.set(10, 10, 10);
scene.add(light);


let box, earth;
loader.load(
  "../models/Earth.glb",
  (gltf) => {
    let earth = gltf.scene;
    modelRoot.add(earth);

    // Center the pivot as before
    box = new THREE.Box3().setFromObject(earth);
    const center = box.getCenter(new THREE.Vector3());
    earth.position.sub(center);
    modelRoot.scale.set(3, 3, 3);
    modelRoot.position.set(0,0,0);
    // modelRoot.position.set(0, -0.5, 0);

    // Set up animation mixer
    const mixer = new THREE.AnimationMixer(earth);
    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });

    // (Optional) Debug log
    console.log("Loaded animations:", gltf.animations);
  },
  undefined,
  (err) => console.error("GLTF load error:", err)
);

// perspective camera
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100); // 3rd param - least distance it will see, 4th - farthest
camera.position.z = 30;
camera.position.y=20;
camera.lookAt(0,0,0)

scene.add(camera);
const helper = new THREE.AxesHelper(5)
scene.add(helper)

// orthographic camera
// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(-1*aspectRatio, 1*aspectRatio, 1, -1, 0.1, 100)

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

modelRoot.position.x = 5
modelRoot.position.z = -2.5
const clock = new THREE.Clock();
const tick2 = () => {
    const elapsedTime = clock.getElapsedTime();
    modelRoot.rotation.y = -Math.PI/2*elapsedTime;
    console.log("elapsedTime :", elapsedTime)/////////
    console.log("sin of elapsedTime :", 3*Math.sin(elapsedTime))/////////
    modelRoot.position.z = 3*(Math.sin(elapsedTime));
    modelRoot.position.x = 3*(Math.sin(elapsedTime+ (Math.PI/2)));
    mesh.rotation.y = elapsedTime;
    mesh.rotation.x = elapsedTime;
    window.requestAnimationFrame(tick2);
    renderer.render(scene, camera);
};
tick2();
