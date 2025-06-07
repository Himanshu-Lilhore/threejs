// Textures

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

// textures
const loadingManager = new THREE.LoadingManager();  // manages loading assets (indicates different loading stanges at which current assets are currently at)  // can be used to show a loader until assets load 
loadingManager.onStart = () => {
	console.log("onStart");
};
loadingManager.onLoad = () => {
	console.log("onLoad");
};
loadingManager.onProgress = () => {
	console.log("onProgress");
};
loadingManager.onError = () => {
	console.log("onError");
};

const textureLoader = new THREE.TextureLoader(loadingManager)  // as the name say, loads textures
// apart from loading the textures, it takes in three arguments for each loading result, we can excute certain instructions based on that state/result
const colorTexture = textureLoader.load(
	"/textures/door/color.jpg",
	() => {
		console.log("load");
	},
	() => {
		console.log("progress");
	},
	() => {
		console.log("error");
	}
);
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const heightTexture = textureLoader.load("/textures/door/height.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
	"/textures/door/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg")
const moire = textureLoader.load(
	"/textures/checkerboard-1024x1024.png"
	// "/textures/checkerboard-8x8.png"
);

let textureArr = [colorTexture, alphaTexture, heightTexture, normalTexture, ambientOcclusionTexture, metalnessTexture, roughnessTexture, moire]

// repeating texture across one direction : 
// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;
// colorTexture.wrapS = THREE.RepeatWrapping;  //X
// colorTexture.wrapT = THREE.RepeatWrapping;  //Y
// // wrapS defines how the texture is wrapped in the U direction
// // wrapT defines how the texture is wrapped in the V direction
// colorTexture.wrapS = THREE.MirroredRepeatWrapping;
// colorTexture.wrapT = THREE.MirroredRepeatWrapping;
// // offsetting
// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;
// // rotation
// colorTexture.rotation = Math.PI * 0.25;
// // rotation around face's center
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;

/*
 * minFilter defines how the texture is filtered when it is displayed at a smaller size than the original image.
 * THREE.NearestFilter: this will display the texture at its original size.
 * THREE.LinearFilter: this will display the texture at a smaller size.
 * generateMipmaps: this will generate a set of smaller textures that are used when the texture is displayed at a smaller size.
 * in case of minFilter = THREE.NearestFilter, generateMipmaps is set to false (default) to avoid generating the smaller textures.
*/
// moire.generateMipmaps = false;
// moire.minFilter = THREE.NearestFilter;
// magFilter defines how the texture is filtered when it is displayed at a larger size than the original image.
// moire.magFilter = THREE.NearestFilter;


const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({
    // color: 0xff0000,
    map: colorTexture
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);


// GUI panel
const parameters = {
    color: "#ff0000",
    spin: () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
    }
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
camera.position.z = 2;
camera.position.x = -1;
camera.position.y = 1;

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

textureArr = textureArr.map(item => {
    item.magFilter = THREE.NearestFilter
    return item;
})
const clock = new THREE.Clock();
const tick2 = () => {
    const elapsedTime = clock.getElapsedTime();
    camera.lookAt(0, 0, 0);
    material.map = textureArr[Math.round(elapsedTime*0.8)%textureArr.length]
    mesh.rotation.y = elapsedTime
    controls.update(); // for damping
    window.requestAnimationFrame(tick2);
    renderer.render(scene, camera);
};
tick2();
