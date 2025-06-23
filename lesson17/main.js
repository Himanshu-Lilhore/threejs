// Raycaster

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



const object1 = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 16, 16),
	new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 16, 16),
	new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 16, 16),
	new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

const objects = [object1, object2, object3]

scene.add(...objects);

const raycaster = new THREE.Raycaster();

// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0)
// rayDirection.normalize()  // normalizing means that vector will become of length 1, and length 1 vector is needed for direction

// raycaster.set(rayOrigin, rayDirection)

// const intersection = raycaster.intersectObjects(objects)
// console.log(intersection)



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


const mouse = new THREE.Vector2();  // vector 2 is used because mouse only moved in 2 dimentions

window.addEventListener("mousemove", (e) => {
	/**
	 * mouse.x & mouse.y = -1 ~ 1
	 */
	mouse.x = (e.clientX / sizes.width) * 2 - 1;
	mouse.y = -(e.clientY / sizes.height) * 2 + 1;

	/**
	 * we will cast ray in the tick function instead of mousemove event handler function,
	 * because mousemove event is fired more frequently than tick function
	 */
});

window.addEventListener("click", () => {
	if (currentIntersect) {
		// console.log("clicked");

		switch (currentIntersect.object) {
			case object1:
				console.log("clicked object1");
				break;
			case object2:
				console.log("clicked object2");
				break;
			case object3:
				console.log("clicked object3");
				break;
		}
	}
});

let currentIntersect

const clock = new THREE.Clock();
const tick2 = () => {
    const elapsedTime = clock.getElapsedTime() * 0.7;

    // camera.position.z = Math.sin(elapsedTime/2)
    // camera.position.x = -Math.cos(elapsedTime/2)

    object1.position.y = Math.sin(2*elapsedTime)*2
    object2.position.y = Math.sin(elapsedTime)*1.5
    object3.position.y = -Math.sin(0.7*elapsedTime)*2

    // Casting ray every frame (not recommended, but fine for now)
    // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // const rayDirection = new THREE.Vector3(10, 0, 0)
    // rayDirection.normalize()

    // raycaster.set(rayOrigin, rayDirection)
    raycaster.setFromCamera(mouse, camera)  // now camera is the origin for the raycaster

    const intersections = raycaster.intersectObjects(objects)

    for (const object of objects) {
		object.material.color.set("#ff0000");
	}

    for (const intersect of intersections) {
		intersect.object.material.color.set("#0000ff");
	}

    /**
	 * this is to detect mouse enter and mouse leave event
	 */
	if (intersections.length) {
		if (currentIntersect === null) {
			console.log("mouse enter");
		}
		currentIntersect = intersections[0];
	} else {
		if (currentIntersect) {
			console.log("mouse leave");
		}
		currentIntersect = null;
	}

    camera.lookAt(0, 0, 0);
    controls.update(); // for damping
    window.requestAnimationFrame(tick2);
    renderer.render(scene, camera);
};
tick2();
