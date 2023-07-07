import { startClient, Actor, Scene, Mesh, Camera, Rotatable } from 'game-engine-canvas-client'

const geometry: Actor & Mesh = {
    id: 'geometry',
    geometry: [
        { x: 10, y: 10 },
        { x: -10, y: 10 },
        { x: 10, y: -10 },
        { x: -10, y: -10 }
    ]
}

const camera: Camera = {
    position: {
        x: 0,
        y: 0,
        z: -250
    },
    rotation: {
        x: 0,
        y: 0
    },
    resolutionX: 1280,
    resolutionY: 720,
    update: deltaTime => {
        const cameraRotation = (camera as Rotatable).rotation
        const distance = (5 / 100) / deltaTime
        cameraRotation.y += distance
        if(cameraRotation.y > 255) cameraRotation.y -= 255
    }
}

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
