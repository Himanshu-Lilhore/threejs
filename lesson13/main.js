// Shadows

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as lil_gui from "lil-gui";

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
// const gui = new lil_gui.GUI({ closed: true, width: 400 });

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.6;
material.roughness = 0.2;



const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);

// const directionalLight = new THREE.DirectionalLight(0xff0000, 2)
// directionalLight.castShadow = true;

const pointLight = new THREE.PointLight(0xFFD700, 10, 100, 2); // yellow 0xFFD700
pointLight.position.set(-1.5, 2, -1.5); // (1, -0.4, 2);  // botton
// turn on cast shadow for each light which should be casting shadows
pointLight.castShadow = true;

scene.add(
    ambientLight,
    pointLight
    // directionalLight
);

// increasing the size of calculated size of the shadow map of a light increases the shadow quality
// but this is not recommended, since it increases the calculation exponentially
console.log(pointLight.shadow);
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;

// For less calculation we can limit the near and far distance of the shadow calculation for each light's shadow's camera
pointLight.shadow.camera.near = 1;
pointLight.shadow.camera.far = 2;

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

// to render shadows :
// directional light uses orthographic camera
// spot light uses perspective camera
// point light uses 6 perspective cameras (for all 6 directions) (therefore 6 camera renders each frame, Heavy)

// light camera helper
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
// scene.add(pointLightCameraHelper);

// shadow blur (this is just a blur filter on whole shadow, not actual blur based on obj distance)
pointLight.shadow.radius = 10;



// BAKED SHADOW
const bakedShadow = textureLoader.load("/textures/shadows/bakedShadow.jpg");
const plane2 = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 4),
    new THREE.MeshBasicMaterial({ map: bakedShadow, side: THREE.DoubleSide })
);
plane2.rotation.x = -Math.PI/2;
plane2.position.y = -0.5;
const sphere2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshBasicMaterial());
const bakedShadowGroup = new THREE.Group()
bakedShadowGroup.add(plane2, sphere2)
bakedShadowGroup.position.y = -5
scene.add(bakedShadowGroup)

// Dynamic shadow
const simpleShadow = textureLoader.load("/textures/shadows/simpleShadow.jpg");
const sphere3 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshBasicMaterial());
const sphere3Shadow = new THREE.Mesh(
	new THREE.PlaneGeometry(1.5, 1.5),
	new THREE.MeshBasicMaterial({
		color: 0x00000,
		transparent: true,
		alphaMap: simpleShadow,
	})
);
const plane3 = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 4), new THREE.MeshBasicMaterial({side: THREE.DoubleSide})
);
plane3.doubleSided= true;
plane3.rotation.x = -Math.PI/2
plane3.position.y = -1/2
sphere3Shadow.rotation.x = -Math.PI * 0.5;
sphere3Shadow.position.y = plane3.position.y + 0.01;
const dynamicShadowGroup = new THREE.Group()
dynamicShadowGroup.add(sphere3, sphere3Shadow, plane3)
dynamicShadowGroup.position.y = 5
scene.add(dynamicShadowGroup);




const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.position.x = -2;
// turn on shadow casting for each object which should cast a shadow
sphere.castShadow = true;
scene.add(sphere);

const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 100), material);
cube.castShadow = true;
scene.add(cube);

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.2, 64, 128), material);
torus.position.x = 2;
torus.castShadow = true;
scene.add(torus);

const planeGround = new THREE.Mesh(new THREE.PlaneGeometry(8, 8, 100, 100), material);
planeGround.position.y = -1;
planeGround.rotation.x = (3 * Math.PI) / 2;

const planeBack = new THREE.Mesh(new THREE.PlaneGeometry(8, 8, 100, 100), material);
planeBack.position.z = -4;

const planeLeft = new THREE.Mesh(new THREE.PlaneGeometry(8, 8, 100, 100), material);
planeLeft.position.x = -4;
planeLeft.rotation.y = Math.PI / 2;

const planeRight = new THREE.Mesh(new THREE.PlaneGeometry(8, 8, 100, 100), material);
planeRight.position.x = 4;
planeRight.rotation.y = (3 * Math.PI) / 2;

const roomWalls = new THREE.Group();
roomWalls.add(planeBack, planeGround, planeLeft, planeRight);
roomWalls.traverse((child) => {
    if (child.isMesh) {
        // turn on shadow receiving on each surface where you want a shadow to be casted
        child.receiveShadow = true;
    }
});
scene.add(roomWalls);

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
scene.add(camera);
camera.position.z = 4;
// camera.position.x = -1;
camera.position.y = 2;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.enableZoom = false;

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.shadowMap.enabled = true; // enable this before first rendering of the scene and camera
// there are different kinds of shadow maps, we choose as per our requirements based on performance or quality
renderer.shadowMap.type = THREE.PCFShadowMap;
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

    // Update Sphere2
    sphere3.position.x = Math.cos(elapsedTime) * 1.5;
    sphere3.position.z = Math.sin(elapsedTime) * 1.5;
    sphere3.position.y = Math.abs(Math.sin(elapsedTime * 3));
    // Update Sphere2Shadow
    sphere3Shadow.position.x = sphere3.position.x;
    sphere3Shadow.position.z = sphere3.position.z;
    sphere3Shadow.material.opacity = (1 - sphere3.position.y) * 0.3;

    camera.lookAt(0, 0, 0);
    controls.update(); // for damping
    window.requestAnimationFrame(tick2);
    renderer.render(scene, camera);
};
tick2();
