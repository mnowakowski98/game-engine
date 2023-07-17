import { startClient, Actor, Scene, Mesh, Camera, Rotatable } from 'game-engine-canvas-client'

const geometry: Actor & Mesh = {
    id: 'geometry',
    geometry: [
        { x: 0, y: 10 },
        { x: -10, y: -10 },
        { x: 10, y: -10 }
    ],
    // rotation: {
    //     x: (90 * Math.PI) / 180,
    //     y: 0
    // },
    material: {
        diffuse: [
            { red: 255, green: 255, blue: 0 },
            { red: 90, green: 150, blue: 30 },
            { red: 75, green: 10, blue: 255 }
        ]
    } //,
    // update: deltaTime => {
    //     const rotation = (geometry as Rotatable).rotation
    //     rotation.x += ((Math.random() * 5 / deltaTime) * Math.PI) / 180
    //     rotation.y -= ((Math.random() * 5 / deltaTime) * Math.PI) / 180
    // }
}

const geometry2: Actor & Mesh = {
    id: 'geometry2',
    geometry: [
        { x: 0, y: 10 },
        { x: -10, y: -10 },
        { x: 10, y: -10 }
    ],
    rotation: {
        x: 0,
        y: 0
    },
    material: {
        diffuse: [
            { red: 255, green: 0, blue: 0 },
            { red: 0, green: 255, blue: 0 },
            { red: 0, green: 0, blue: 255 }
        ]
    },
    update: deltaTime => {
        const rotation = (geometry2 as Rotatable).rotation
        rotation.x -= ((Math.random() * 5 / deltaTime) * Math.PI) / 180
        // rotation.y += ((Math.random() * 5 / deltaTime) * Math.PI) / 180
    }
}

const camera: Camera = {
    id: 'main-camera',
    position: {
        x: 0,
        y: 0,
        z: -100
    },
    rotation: {
        x: 0,
        y: 0,
        z: 0
    },
    resolutionX: 1280,
    resolutionY: 720
}

const scene: Scene = {
    id: 'game-scene',
    cameras: new Map().set(camera.id, {
        camera: camera,
        screenPosition: {
            x: 0,
            y: 0
        }
    }),
    actors: new Map()
        .set(geometry.id, geometry)
        .set(geometry2.id, geometry2)
}



startClient({
    initialSceneId: 'game-scene',
    scenes: [scene]
})
