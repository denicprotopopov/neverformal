import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'


/**
 * Cursor
 */
const cursor = {
    x: 0,
    y: 0
}



if ("ontouchstart" in document.documentElement)
    {
        let touchHandler = (event) => {
    
            if (event.touches && event.touches[0]) {
                cursor.x = (event.touches[0].clientX - (window.innerWidth * 0.5)) / 100
                cursor.y = (event.touches[0].clientY - (window.innerWidth * 0.5)) / 100
            } else if (event.originalEvent && event.originalEvent.changedTouches[0]) {
                cursor.x = (event.originalEvent.changedTouches[0].clientX - (window.innerWidth * 0.5)) / 100
                cursor.y = (event.originalEvent.changedTouches[0].clientY - (window.innerWidth * 0.5)) / 100
            } else if (event.clientX && event.clientY) {
                cursor.x = (event.clientX - (window.innerWidth * 0.5)) / 100
                cursor.y = (event.clientY - (window.innerWidth * 0.5)) / 100
            }
        
        }
        
        window.addEventListener('touchstart', touchHandler, false)
        window.addEventListener('touchmove', touchHandler, false)
        window.addEventListener('touchend', touchHandler, false)

    } else {
        window.addEventListener(
            'mousemove',
            (event) => {
                cursor.x = (event.clientX - (window.innerWidth * 0.5)) / 100
                cursor.y = (event.clientY - (window.innerHeight * 0.5)) / 100
            })
    }





/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')

/**
 * Fonts
 */
const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/ARVAQ_Regular.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'NEVERFORMAL',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 64,
                bevelEnabled: true,
                bevelThickness: 0.02,
                bevelSize: 0.01,
                bevelOffset: 0,
                bevelSegments: 3
            }
        )

        textGeometry.center()
        const material = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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


scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    camera.position.x += ( cursor.x - camera.position.x ) * 0.02;
    camera.position.y += ( - cursor.y - camera.position.y ) * 0.02;
    camera.position.z = 5 - sizes.width / sizes.height

    camera.lookAt( 0, 0, 0 );

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()