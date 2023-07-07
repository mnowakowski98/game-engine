import { startClient, Actor, Scene, Mesh, Camera, Rotatable, Positionable } from 'game-engine-canvas-client'

const geometry: Actor & Mesh = {
    id: 'geometry',
    geometry: [
        { x: 10, y: 10 },
        { x: -10, y: 10 },
        { x: 10, y: -10 },
        { x: -10, y: -10 }
    ]
}

let mouseMoveDistanceX = 0
let mouseMoveDistanceY = 0

const camera: Camera = {
    position: {
        x: 0,
        y: 0,
        z: -250
    },
    rotation: {
        x: 0,
        y: 0,
        z: 0
    },
    resolutionX: 1280,
    resolutionY: 720,
    update: deltaTime => {
        const distanceX = mouseMoveDistanceY / deltaTime
        const distanceY = mouseMoveDistanceX / deltaTime

        const cameraRotation = (camera as Rotatable).rotation
        cameraRotation.x += distanceX
        cameraRotation.y += distanceY

        if (cameraRotation.x > 255) cameraRotation.x -= 255
        if (cameraRotation.y > 255) cameraRotation.y -= 255

        mouseMoveDistanceX = 0
        mouseMoveDistanceY = 0
    }
}

addEventListener('mousemove', event => {
    mouseMoveDistanceX = event.movementX
    mouseMoveDistanceY = event.movementY

    
})

const scene: Scene = {
    id: 'game-scene',
    cameras: () => [{
        camera: camera,
        screenPosition: {
            x: 0,
            y: 0
        }
    }],
    world: () => ({
      actors: () => [geometry]  
    })
}

startClient({
    initialSceneId: 'game-scene',
    scenes: [scene]
})
