const sizes = {
    width: 800,
    height: 600
}

// scene
const scene = new THREE.Scene()

// stuff
const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({color: 0xff0000})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)  // fov = 75
camera.position.z = 3
camera.position.y = 1
camera.position.x = 1
scene.add(camera)

// renderer
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)