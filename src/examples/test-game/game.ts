import { startClient, Actor, Scene, Mesh, Camera } from 'game-engine-canvas-client'

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
    resolutionX: 1280,
    resolutionY: 720
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
