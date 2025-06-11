// // Materials

// import * as THREE from "three";
// import { FontLoader, OrbitControls } from "three/examples/jsm/Addons.js";
// import * as lil_gui from "lil-gui";
// import gsap from "gsap";
// import { TextGeometry } from "three/examples/jsm/Addons.js";

// const sizes = {
//     width: window.innerWidth,
//     height: window.innerHeight,
// };
// const gui = new lil_gui.GUI({ closed: true, width: 400 });

// const canvas = document.querySelector("canvas.webgl");
// const scene = new THREE.Scene();

// // textures
// const textureLoader = new THREE.TextureLoader()

// const doorColorTx = textureLoader.load("/textures/door/color.jpg")  // Tx : Texture
// const doorAlphaTx = textureLoader.load("/textures/door/alpha.jpg")
// const doorAmbientOccTx = textureLoader.load("/textures/door/ambientOcclusion.jpg")
// const doorHeightTx = textureLoader.load("/textures/door/height.jpg")
// const doorMetalnessTx = textureLoader.load("/textures/door/metalness.jpg")
// const doorNormalTx = textureLoader.load("/textures/door/normal.jpg")
// const doorRoughnessTx = textureLoader.load("/textures/door/roughness.jpg")

// const matcapTx = textureLoader.load("/textures/matcaps/4.png")  // get more matcap textures here : github.com/nidorx/matcaps
// const gradientTx = textureLoader.load("/textures/gradients/3.jpg")

// // material defines the property of each pixel being rendered
// // 1. most basic meterial of all
// // const material = new THREE.MeshBasicMaterial()
// // material.color = new THREE.Color('pink')   // once material is instantiated, we need to provide Color class object to set the color, or use color.set
// // material.color = new THREE.Color('#ff0000')
// // material.color = new THREE.Color(0x00ff00)
// // material.color.set('pink')
// // material.wireframe = true
// // material.transparent = true  // to put opacity/alpha value, you also have to set this property
// // material.opacity = 0.5  // (alpha = opacity)
// // material.alphaMap = doorAlphaTx
// // material.side = THREE.FrontSide
// // material.side = THREE.BackSide
// // material.side = THREE.DoubleSide

// // 2. MeshNormalMaterial : represents normals (perpendicular direction) at each surface point with different colors
// // Knowing the direction of normals help with lighting, reflections & refractions
// // const material = new THREE.MeshNormalMaterial()  // all the properties from MeshBasicMaterial work on this
// // material.flatShading = true
// // material.side = THREE.DoubleSide

// // 3. MeshMatcapMaterial : takes matcap texture to simulate lighting with having a light source in the scene (since matcap textures contain all the info about lighting for every possible pixel render/shadow)
// // const material = new THREE.MeshMatcapMaterial()
// // material.side = THREE.DoubleSide
// // material.matcap = matcapTx

// // 4. MeshDepthMaterial : Lightens the shade if material is close to the near of camera, and darkens if its is close to the far of camera
// // const material = new THREE.MeshDepthMaterial()

// // 5. MeshLambertMaterial : First material (till now) which reacts to light
// // this material is very performant, but at the cost of having shading lines on the object
// // const material = new THREE.MeshLambertMaterial()

// // 6. MeshPhongMaterial : solves the lines problem of Lambert Material  // smoothing gradient to shadow when light falls
// // const material = new THREE.MeshPhongMaterial()
// // material.shininess = 100
// // material.specular = new THREE.Color(0xff0000)  // color of the light reflection

// // 7. MeshToonMaterial
// // const material = new THREE.MeshToonMaterial()  // cartoonish shading
// // material.gradientMap = gradientTx
// // gradientTx.magFilter = THREE.NearestFilter
// // gradientTx.minFilter = THREE.NearestFilter
// // gradientTx.generateMipmaps = false  // performance

// // 8*. MeshStandardMaterial : most commonly used one, it uses physically based rendering principles
// const material = new THREE.MeshStandardMaterial()
// material.metalness = 0.6
// material.roughness = 0.2
// material.map = doorColorTx

// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 32, 32),
//     material
// )
// sphere.position.x = -2
// scene.add(sphere)

// const plane = new THREE.Mesh(
//     new THREE.PlaneGeometry(1, 1),
//     material
// )
// scene.add(plane)

// const torus = new THREE.Mesh(
//     new THREE.TorusGeometry(0.4, 0.2, 16, 32),
//     material
// )
// torus.position.x = 2
// scene.add(torus)

// // lights
// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// scene.add(ambientLight)
// const pointLight = new THREE.PointLight(0xffffff, 20)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 3
// scene.add(pointLight)

// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
// scene.add(camera);
// camera.position.z = 3;
// // camera.position.x = -1;
// // camera.position.y = 1;

// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.enableZoom = false;

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
// const tick2 = () => {
//     const elapsedTime = clock.getElapsedTime();

//     sphere.rotation.x = -elapsedTime*0.1
//     plane.rotation.z = elapsedTime*0.2
//     torus.rotation.x = elapsedTime*0.1
//     sphere.rotation.y = elapsedTime*0.2
//     // plane.rotation.y = -elapsedTime*0.1
//     torus.rotation.y = elapsedTime*0.2

//     camera.lookAt(0, 0, 0);
//     controls.update(); // for damping
//     window.requestAnimationFrame(tick2);
//     renderer.render(scene, camera);
// };
// tick2();




// ANIMATION FOR TWITTER 

// Materials

import * as THREE from "three";
import { FontLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import * as lil_gui from "lil-gui";
import gsap from "gsap";
import { TextGeometry } from "three/examples/jsm/Addons.js";

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
// const gui = new lil_gui.GUI({ closed: true, width: 400 });

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

// textures
const textureLoader = new THREE.TextureLoader();

const doorColorTx = textureLoader.load("/textures/door/color.jpg"); // Tx : Texture
const doorAlphaTx = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOccTx = textureLoader.load("/textures/door/ambientOcclusion.jpg");
const doorHeightTx = textureLoader.load("/textures/door/height.jpg");
const doorMetalnessTx = textureLoader.load("/textures/door/metalness.jpg");
const doorNormalTx = textureLoader.load("/textures/door/normal.jpg");
const doorRoughnessTx = textureLoader.load("/textures/door/roughness.jpg");

const matcapTx = textureLoader.load("/textures/matcaps/4.png"); // get more matcap textures here : github.com/nidorx/matcaps
const gradientTx = textureLoader.load("/textures/gradients/5.jpg");

// material defines the property of each pixel being rendered
// 1. most basic meterial of all
// const material = new THREE.MeshBasicMaterial()
// material.color = new THREE.Color('pink')   // once material is instantiated, we need to provide Color class object to set the color, or use color.set
// material.color = new THREE.Color('#ff0000')
// material.color = new THREE.Color(0x00ff00)
// material.color.set('pink')
// material.wireframe = true
// material.transparent = true  // to put opacity/alpha value, you also have to set this property
// material.opacity = 0.5  // (alpha = opacity)
// material.alphaMap = doorAlphaTx
// material.side = THREE.FrontSide
// material.side = THREE.BackSide
// material.side = THREE.DoubleSide

// 2. MeshNormalMaterial : represents normals (perpendicular direction) at each surface point with different colors
// Knowing the direction of normals help with lighting, reflections & refractions
// const material = new THREE.MeshNormalMaterial()  // all the properties from MeshBasicMaterial work on this
// material.flatShading = true
// material.side = THREE.DoubleSide

// 3. MeshMatcapMaterial : takes matcap texture to simulate lighting with having a light source in the scene (since matcap textures contain all the info about lighting for every possible pixel render/shadow)
// const material = new THREE.MeshMatcapMaterial()
// material.side = THREE.DoubleSide
// material.matcap = matcapTx

// 4. MeshDepthMaterial : Lightens the shade if material is close to the near of camera, and darkens if its is close to the far of camera
// const material = new THREE.MeshDepthMaterial()

// 5. MeshLambertMaterial : First material (till now) which reacts to light
// this material is very performant, but at the cost of having shading lines on the object
// const material = new THREE.MeshLambertMaterial()

// 6. MeshPhongMaterial : solves the lines problem of Lambert Material  // smoothing gradient to shadow when light falls
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0xff0000)  // color of the light reflection

// 7. MeshToonMaterial
// const material = new THREE.MeshToonMaterial()  // cartoonish shading
// material.gradientMap = gradientTx
// gradientTx.magFilter = THREE.NearestFilter
// gradientTx.minFilter = THREE.NearestFilter
// gradientTx.generateMipmaps = false  // performance

// 8*. MeshStandardMaterial : most commonly used one, it uses physically based rendering principles
// const material = new THREE.MeshStandardMaterial()
// material.metalness = 0.6
// material.roughness = 0.2
// material.map = doorColorTx

// — make sure you’ve done this before using gradientTx:
gradientTx.magFilter = THREE.NearestFilter;
gradientTx.minFilter = THREE.NearestFilter;
gradientTx.generateMipmaps = false;

const meshTypes = {
    "Basic Material": new THREE.MeshBasicMaterial({
        color: new THREE.Color("pink"),
        wireframe: true,
        transparent: true,
        opacity: 0.5,
        // alphaMap: doorAlphaTx,
        side: THREE.DoubleSide,
    }),

    "Normal Material": new THREE.MeshNormalMaterial({
        flatShading: true,
        side: THREE.DoubleSide,
    }),

    "Matcap Material": new THREE.MeshMatcapMaterial({
        matcap: matcapTx,
        side: THREE.DoubleSide,
    }),

    "Depth Material": new THREE.MeshDepthMaterial({
        side: THREE.DoubleSide,
    }),

    "Lambert Material": new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
    }),

    "Phong Material": new THREE.MeshPhongMaterial({
        shininess: 300,
        specular: new THREE.Color(0x0000ff),
        side: THREE.DoubleSide,
    }),

    "Toon Material": new THREE.MeshToonMaterial({
        gradientMap: gradientTx,
        side: THREE.DoubleSide,
    }),

    "Standard Material": new THREE.MeshStandardMaterial({
        metalness: 0.8,
        roughness: 0.2,
        map: doorColorTx,
        side: THREE.DoubleSide,
    }),
};

const fontLoader = new FontLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");

const material2 = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
    const groups = Object.keys(meshTypes).map((item, index) => {
        const title = new TextGeometry(item, {
            font: font,
            size: 0.3,
            height: 0.2,
            curveSegments: 6,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5,
            depth: 0.1,
        });
        title.center();

        const material = meshTypes[item];
        material.side = THREE.DoubleSide;

        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
        sphere.position.x = -2;
        scene.add(sphere);

        const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
        scene.add(plane);

        const torus = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.2, 32, 64), material);
        torus.position.x = 2;
        scene.add(torus);
        
        if(item==='Depth Material') {
            torus.position.x = 1.4;
            sphere.position.x = -2;
            sphere.position.z = -1
            plane.position.z = 0.4
            torus.position.z = 1
        }

        const titleText = new THREE.Mesh(title, material2);
        titleText.position.y = 1
        titleText.position.x = -1

        const group = new THREE.Group();
        group.add(sphere, plane, torus, titleText);
        group.position.y = -index * 3;
        scene.add(group);
    });
});

// lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 20);
pointLight.position.x = 2.5;
pointLight.position.y = 2;
pointLight.position.z = 2;
scene.add(pointLight);

const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 1.5, 100);
scene.add(camera);
camera.position.z = 3;
// camera.position.x = -1;
// camera.position.y = 1;

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

const clock = new THREE.Clock();
const speed = 0.8
const tick2 = () => {
    const elapsedTime = clock.getElapsedTime();

    // sphere.rotation.x = -elapsedTime*0.1
    // plane.rotation.z = elapsedTime*0.2
    // torus.rotation.x = elapsedTime*0.1
    // sphere.rotation.y = elapsedTime*0.2
    // plane.rotation.y = -elapsedTime*0.1
    // torus.rotation.y = elapsedTime*0.2

    camera.position.y = -elapsedTime*speed;
    camera.position.z = 3.5 + Math.cos(elapsedTime*speed)/3;
    camera.position.x = Math.sin(elapsedTime*speed)/2;
    controls.target.set(0, -elapsedTime*speed, 0);
    pointLight.position.y = -elapsedTime*speed;
    // camera.lookAt(0, 0, 0);
    controls.update(); // for damping
    window.requestAnimationFrame(tick2);
    renderer.render(scene, camera);
};
tick2();
