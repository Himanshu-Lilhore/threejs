import * as THREE from "three";

const sizes = {
    width: 1300, //1100,
    height: 750,
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 6;
scene.add(camera);

// const axesHelper = new THREE.AxesHelper();
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

// Object3D is the parent class of all the classes in threejs, that mean all the classes inherited from it share the same properties.
// Vector3 class
// mesh.position.x = 1
// mesh.position.y = 2
mesh.position.set(2,3,0.5); 
console.log( mesh.position.length()) // mesh.position is a vector3 object // this will basically give lenth of that vector3, which is from 0,0,0 to 2,3,0.5
console.log("distance from 0,1,2 : ", mesh.position.distanceTo(new THREE.Vector3(0,1,2)))  // distance of that mesh from that point
console.log("distance from camera : ", mesh.position.distanceTo(camera.position))  // distance of that mesh from that point

// mesh.scale.y = 2
// mesh.scale.z = 3
mesh.scale.set(1, 2, 3);

// when we rotate a mesh around an axis, other axis will rotate with it, so we have to keep that is mind, and also the order of rotation.
mesh.rotation.reorder("YXZ"); // changing the order or rotation //
mesh.rotation.y = Math.PI * 0.3; // 1 PI radian = 180 deg
mesh.rotation.x = Math.PI * 0.6; // 1 PI radian = 180 deg

// One good solution to this problem or rotation and their order is Quaternion.
// quaternion and rotate interfere with each other, changing one will change the other, so better to use one at a time.

camera.lookAt(mesh.position); // camera will look at the center of that vector // takes in a vector3 reference

// scene graph (group)
const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
cube1.position.x = -2
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
cube2.position.x = 0
const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
cube3.position.x = 2
group.add(cube1)
group.add(cube2)
group.add(cube3)
scene.add(group)

group.scale.y = 2
group.rotation.y = 2

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
