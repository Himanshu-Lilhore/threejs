// Animations

import * as THREE from "three";
import gsap from 'gsap'

const sizes = {
    width: 1300, //1100,
    height: 750,
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 4;
scene.add(camera);

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);


// animations
// e.g.1
let iniTime = new Date()
const tick1 = () => {
    const currTime = new Date()
    const delta = currTime - iniTime
    iniTime = currTime

    // mesh.rotation.y += 0.002  // instead of doing this, we put delta, so that the animation runs at same rate on every fps
    mesh.rotation.y += 0.002 * delta

    window.requestAnimationFrame(tick1)  // tells next frame how to run animation by passing it a function, thats it
    renderer.render(scene, camera);
}
// tick1()

// e.g.2
// instead of calculating and adjusting animation for fps manually, we can use Clock class
const clock = new THREE.Clock()
const tick2 = () => {
    const elapsedTime = clock.getElapsedTime()  // gives elapsed time in seconds

    mesh.rotation.y = elapsedTime  // no need to do +=  since elapsedTime is always increasing
    mesh.rotation.x = elapsedTime
    mesh.position.x = Math.sin(elapsedTime)
    mesh.position.y = Math.cos(elapsedTime)
    mesh.position.z = Math.tan(elapsedTime)
    // can also apply this to camera
    // camera.position.z = elapsedTime
    camera.lookAt(mesh.position)

    window.requestAnimationFrame(tick2)
    renderer.render(scene, camera);
}
// tick2()
// never use getDelta for from Clock class, it can mess with internal workings of the class and give inconsitent results

// e.g.3
gsap.to(mesh.position, {x: 2, duration: 1, delay: 1})  // we don't have to request animation frame for gsap, it does that internally, we just have to do it for our renderer
gsap.to(mesh.position, {x: -2, y: 2, duration: 1, delay: 2})  // we don't have to request animation frame for gsap, it does that internally, we just have to do it for our renderer
const tick3 = () => {
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick3)
}
tick3()
 