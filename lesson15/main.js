// Particles

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as lil_gui from "lil-gui";

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
const gui = new lil_gui.GUI({ closed: true, width: 400 });
gui.domElement.style.display = 'none';

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();

const particleTx = textureLoader.load('/textures/particles/2.png')



const particleMaterial = new THREE.PointsMaterial()
particleMaterial.size = 0.115
// particleMaterial.color.set("red")
particleMaterial.transparent = true
particleMaterial.alphaMap = particleTx
particleMaterial.vertexColors = true  // for coloring each vertex differently
particleMaterial.sizeAttenuation = true  
// true : closer the particle, bigger the size
// false : size of particle remains same regardless of distance

particleMaterial.alphaTest = 0.001  // use this if particles are not be shown in closeup

// particleMaterial.depthTest = false  // this causes particles to stop checking for depth, so they will be rendered through objects

particleMaterial.depthWrite = false
particleMaterial.blending = THREE.AdditiveBlending



// const particleGeometry = new THREE.SphereGeometry(1, 32, 32)

const particleGeometry = new THREE.BufferGeometry()
const numOfParticles = 3000
const positions = new Float32Array(numOfParticles * 3)  // x3 to define position of particle in 3d space
const colors = new Float32Array(numOfParticles * 3)  // x3 to define position of particle in 3d space
for(let i=0; i<numOfParticles*3; i++) {
    positions[i] = (Math.random()-0.5)*5
    colors[i] = Math.random();
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));


const particles = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particles)


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 100);
scene.add(camera);
camera.position.z = 1;
// camera.position.x = -1;

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
    const elapsedTime = clock.getElapsedTime()*0.7;

    camera.position.z = Math.sin(elapsedTime/2)
    camera.position.x = Math.cos(elapsedTime/2)

    // manipulating buffer attributes array every tick to make particles move
    // but this is a non-performant way of animating particles (don't do it)
    for (let i = 0; i < numOfParticles; i++) {
		const i3 = i * 3;
		const x = particleGeometry.attributes.position.array[i3];
        const y = particleGeometry.attributes.position.array[i3 + 1]
		particleGeometry.attributes.position.array[i3 + 1] = Math.sin(
			elapsedTime + x + y/2
		);
		particleGeometry.attributes.position.needsUpdate = true;
	}

    camera.lookAt(0, 0, 0);
    controls.update(); // for damping
    window.requestAnimationFrame(tick2);
    renderer.render(scene, camera);
};
tick2();
