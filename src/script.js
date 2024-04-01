import * as THREE from 'three'
import GUI from 'lil-gui'

import gsap from 'gsap'
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { TextPlugin } from "gsap/TextPlugin";

import vertexShader from './shaders/vertex.glsl'
import mainFragmentShader from './shaders/fragment.glsl'
import squareFragmentShader from './shaders/fragment_square.glsl'
import textFragmentShader from './shaders/fragment_text.glsl'

import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

gsap.registerPlugin(MotionPathPlugin,TextPlugin);

/**
 * Fonts
 */
const fontLoader = new FontLoader()
let textMaterial;
fontLoader.load(
    './Integral_Bold_Regular.json',
    (font) =>
    {
        let size = 0.25;
        let posX = -0.42;
        if(window.innerWidth < 1050)
        {
            size = 0.15;
            posX = -0.27 ;
        }
        if(window.innerWidth < 800)
        {
            size = 0.125;
            posX = -0.22 ;
        }
        if(window.innerWidth < 500)
        {
            size = 0.12;
            posX = -0.2 ;
        }

        const textGeometry = new TextGeometry(
            'NOW',
            {
                font: font,
                size: size,
                height: 0.01,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 0,
                bevelSize: 0,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: textFragmentShader,
            side: THREE.DoubleSide,
            transparent: true,
            uniforms:
            {
                uTime: { value: 0 },
                uPaletteMultiplier: { value: sizes.width < 1000 ? 5 : 3.5 },
                resolution: { value: new THREE.Vector2(sizes.width, sizes.height) },
            }
        })
        const text = new THREE.Mesh(textGeometry, textMaterial)
        text.position.set(posX, -2, 0)
        scene.add(text)
    }
)

/**
 * Base
 */
// Debug
// const gui = new GUI()

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
let size2 = 0.75 ;
if(window.innerWidth < 1050)
{
    size2 = 0.5 ;
}
if(window.innerWidth < 500)
{
    size2 = 0.4 ;
}
if(window.innerWidth < 350)
{
    size2 = 0.3 ;
}

let posYMesh2 = -1;
if(window.innerWidth < 1280 && window.innerWidth > window.innerHeight)
{
    posYMesh2 -= 0.03 ;
}

const material2 = material1.clone()
material2.fragmentShader = squareFragmentShader
const mesh2 = new THREE.Mesh(geometry, material2)
mesh2.scale.set(size2,size2,size2)
mesh2.position.set(0, posYMesh2, 0)
scene.add(mesh2)

// Third
const material3 = material1.clone()
const size3 = window.innerWidth < 1000 ? 0.08 : 0.12
// material3.fragmentShader = discFragmentShader
material3.fragmentShader = squareFragmentShader
const mesh3 = new THREE.Mesh(geometry, material3)
mesh3.scale.set(size3,size3,size3)
mesh3.rotateX(-Math.PI/2)
mesh3.rotateY(Math.PI/6)

let posXMesh3 = window.innerWidth < 1050 ? -0.28 : -0.42;
if(window.innerWidth < 800)
{
    posXMesh3 =  -0.22;
}
if(window.innerWidth < 500)
{
    posXMesh3 =  -0.2 ;
}

mesh3.position.set(posXMesh3, -2, 0)
scene.add(mesh3)

const nowSection = document.getElementById('now')

const sectionMeshes = [ mesh1, mesh2, mesh3 ] 
const animations = {
    0 : null,
    1: () => gsap.to(
        mesh2.rotation,
        {
            duration: 1.5,
            ease: 'power2.inOut',
            x: '+='+Math.PI,
            y: '+='+Math.PI,
            z: '+=0'
        }  
    ) ,
    2:() => {
        gsap.to(
            mesh3.rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=0',
                y: '+=0',
                z: '+=6'
            }
        )
        // gsap.to(
        //     mesh3.position,
        //     {
        //         duration: 1.5,
        //         ease: 'power2.inOut',
        //         x: mesh3.position.x == 1 ? -1 : 1,
        //         y: '+=0',
        //         z: '+=0'
        //     }
        // )
        // if(nowSection && nowSection.innerText == "NOW")
        // {
        //     gsap.to(nowSection, {
        //         duration: 1,
        //         text: {
        //           value: "PAST",
        //           newClass: "animated",
        //           delimiter: " ",
        //         },
        //       });
        // }
    } 
 ,
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
    const newSection = Math.floor(scrollY / sizes.height )
    if(newSection != currentSection)
    {
        console.log(currentSection)
        console.log(newSection)
        currentSection = newSection

        if(!animations[currentSection])
            return;

        animations[currentSection]()
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
    // sizes.width = window.innerWidth
    // sizes.height = window.innerHeight

    // Update camera
    // camera.aspect = sizes.width / sizes.height
    // camera.updateProjectionMatrix()

    // Update renderer
    // renderer.setSize(sizes.width, sizes.height)
    // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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
    if(textMaterial)
        textMaterial.uniforms.uTime.value = elapsedTime

    // mesh3.rotateY(-Math.PI/8 / 190)
    

    // Animate camera
    camera.position.y = - scrollY / sizes.height * parameters.objectsDistance

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()