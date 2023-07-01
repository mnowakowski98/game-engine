import { start, Scene, Actor, Camera } from 'game-engine-canvas-client'

const geometry: Actor = {
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
    resolutionY: 720,
    rotation: {
        x: 0,
        y: 0
    },
    update: () => undefined
}

const scene: Scene = {
    id: 'game-scene',
    cameras: () => [{
        camera: camera,
        position: {
            x: 0,
            y: 0
        }
    }],
    world: () => ({
      actors: () => [geometry]  
    })
}

start({
    initialSceneId: 'game-scene',
    scenes: [scene]
})
