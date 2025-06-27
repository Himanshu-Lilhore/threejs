const lesson = "physics"
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { commonEventListeners, sizes, guiInit } from "../utils/common";

const debugObj = { val1: 3}
const gui = guiInit(lesson, debugObj)




const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const pointLight = new THREE.PointLight(0xffffff, 4, 10, 1)
pointLight.position.set(2, 1, 1)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(pointLight, ambientLight)


const generateSphere = () => {
	const sphere = new THREE.Mesh(
		new THREE.SphereGeometry(0.6, 32, 32),
		new THREE.MeshStandardMaterial({})
	)
	sphere.position.set((Math.random()-1/2)*5, (Math.random()-1/2)*5, (Math.random()-1/2)*5)
	scene.add(sphere)
	console.log('generated a sphere')
}

const cube = new THREE.Mesh(
	new THREE.BoxGeometry(1,1,1),
	new THREE.MeshStandardMaterial({})
)
// scene.add(cube)

debugObj.createSphere = () => generateSphere()
gui.add(debugObj, "createSphere").name("Generate sphere")




const camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height, 0.01, 100);
scene.add(camera);
camera.position.z = 5;
// camera.position.y = 2;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.enableZoom = false;

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);




const clock = new THREE.Clock();
const animateFrame = () => {
    const elapsedTime = clock.getElapsedTime() * 0.7;

    // camera.position.z = Math.sin(elapsedTime/2)
    // camera.position.x = -Math.cos(elapsedTime/2)


    camera.lookAt(0, 0, 0);
    controls.update(); // for damping
    window.requestAnimationFrame(animateFrame);
    renderer.render(scene, camera);
};

animateFrame();
commonEventListeners(camera, renderer, canvas);