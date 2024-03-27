import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'
import vertexShader from './shaders/vertex.glsl'
import mainFragmentShader from './shaders/fragment.glsl'
import squareFragmentShader from './shaders/fragment_square.glsl'
import discFragmentShader from './shaders/fragment_disc.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI()

const parameters = {
    objectsDistance : 1 
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

// First

// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

// Material
const material1 = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: mainFragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
    uniforms:
    {
        uTime: { value: 0 },
    }
})

// Mesh
const mesh1 = new THREE.Mesh(geometry, material1)
scene.add(mesh1)

// Second
const material2 = material1.clone()
material2.fragmentShader = squareFragmentShader
const mesh2 = new THREE.Mesh(geometry, material2)
mesh2.scale.set(0.75,0.75,0.75)
mesh2.position.set(0, -1.25, 0)
scene.add(mesh2)

// Third
const material3 = material1.clone()
material3.fragmentShader = discFragmentShader
const mesh3 = new THREE.Mesh(geometry, material3)
// mesh3.scale.set(4.5,2.5,0)
mesh3.rotateX(-Math.PI/4)
mesh3.position.set(0, -2.85, -0.5)
scene.add(mesh3)


const sectionMeshes = [mesh1,mesh2,mesh3] 
const animations = {
    0 : null,
    1: {
        duration: 1.5,
        ease: 'power2.inOut',
        x: '+=3',
        y: '+=3',
        z: '+=0'
    },
    2: {
        duration: 1.5,
        ease: 'power2.inOut',
        x: '+=0',
        y: '+=0',
        z: '+=0'
    },
}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0
window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)
    if(newSection != currentSection)
    {
        currentSection = newSection

        if(!animations[currentSection])
            return;

        gsap.to(
            sectionMeshes[currentSection].rotation,
            animations[currentSection]
        )
    }
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, - 0, 0.65)
scene.add(camera)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime

function clamp(value, min, max)
{
    let clamped = value > min ? value : min;
    clamped = clamped < max ? clamped : max 

    return clamped;
}

function lerp (start, end, amt){
    return (1-amt)*start+amt*end
  }

let animation_forwards = true
let animation_value = 0
const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()
    if(Math.floor(elapsedTime) != Math.floor(previousTime))
    {
        previousTime = elapsedTime
    }

    if(animation_forwards)
        // animation_value = lerp(animation_value, 40, 0.01);
        animation_value += 0.03;
    else 
        // animation_value = lerp(animation_value, 0, 0.01);
        animation_value -= 0.03;

    if(animation_forwards && animation_value >= 40)
        animation_forwards = false;
    else if(!animation_forwards && animation_value <= 0)
        animation_forwards = true

    // Update materials
    material1.uniforms.uTime.value = animation_value

    // mesh3.rotateY(-Math.PI/8 / 190)
    

    // Animate camera
    camera.position.y = - scrollY / sizes.height * parameters.objectsDistance

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()