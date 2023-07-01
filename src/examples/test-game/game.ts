import { start, Scene } from 'game-engine-canvas-client'

const scene: Scene = {
    id: 'game-scene'
}

start({
    initialSceneId: 'game-scene',
    scenes: [scene]
    // network: {
    //     remoteUrl: 'localhost:3000',
    //     receivers: () => [],
    //     updaters: () => []
    // }
})

// export function startOld(width: () => number, height: () => number): Scene {
//     const spaceCommand: Command = {
//         code: 'Space',
//         type: 'press',
//         action: () => alert('derp')
//     }

//     const inputContext: InputContext = {
//         id: 'game-input-context',
//         commands: [spaceCommand]
//     }

//     const { buttonStates, axisStates } = startInputContext(inputContext)

//     const localGeometry: Actor = {
//         id: 'host-geometry',
//         geometry: [
//             { x: 10, y: 10 },
//             { x: -10, y: 10 },
//             { x: 10, y: -10 },
//             { x: -10, y: -10 }
//         ],
//         position: {
//             x: 0,
//             y: 0,
//             z: 0
//         }
//     }

//     let remoteCamera: Camera = {
//         resolutionX: width(),
//         resolutionY: height(),
//         position: {
//             x: 0,
//             y: 0,
//             z: -100
//         },
//         rotation: {
//             x: 0,
//             y: 0
//         },
//         update: () => undefined
//     }

//     const remoteCameraReceiver: Receiver<Camera> = {
//         id: 'remote-camera',
//         onRemoteSync: camera => remoteCamera.rotation = camera.rotation
//     }

//     const localCamera: Camera = {
//         resolutionX: width(),
//         resolutionY: height(),
//         position: {
//             x: 0,
//             y: 0,
//             z: -200
//         },
//         rotation: {
//             x: 0,
//             y: 0
//         },
//         update: (deltaTime) => {
//             const speed = 5
//             let directedSpeed = 0
//             if (buttonStates.get('KeyA')) directedSpeed -= speed
//             if (buttonStates.get('KeyD')) directedSpeed += speed

//             const mouseMoveX = axisStates.get('mouseX')
//             let yRotationToAdd = directedSpeed
//             if (mouseMoveX) yRotationToAdd += mouseMoveX
//             localCamera.rotation.y += deg2rad(movementDistance(yRotationToAdd, deltaTime) % 360)
            
//             const mouseMoveY = axisStates.get('mouseY')
//             if (mouseMoveY) {
//                 const xRotationToAdd = mouseMoveY
//                 localCamera.rotation.x += deg2rad(movementDistance(xRotationToAdd, deltaTime) % 360)
//             }
//         }
//     }

//     const cameraUpdater: Updater<Camera> = {
//         for: remoteCameraReceiver.id,
//         syncData: () => localCamera
//     }

//     const gameScene: Scene = {
        
//     }

//     return gameScene
// }