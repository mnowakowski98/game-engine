import { Command, InputContext, startInputContext } from '../../feature/input/input'
import Scene from '../../feature/scene/scene'
import { Actor } from '../../foundation/engine/rendering/world'
import { movementDistance } from '../../foundation/engine/space/distance'
import { deg2rad } from '../../foundation/engine/space/rotation'
import { Updater, Receiver, startRemoteSyncing } from '../../feature/sync/sync'
import Camera from '../../foundation/engine/rendering/camera'

export function start(width: () => number, height: () => number): Scene {
    const spaceCommand: Command = {
        code: 'Space',
        type: 'press',
        action: () => alert('derp')
    }

    const inputContext: InputContext = {
        id: 'game-input-context',
        commands: [spaceCommand]
    }

    const { buttonStates, axisStates } = startInputContext(inputContext)


    const localGeometry: Actor = {
        id: 'host-geometry',
        geometry: [
            { x: 10, y: 10 },
            { x: -10, y: 10 },
            { x: 10, y: -10 },
            { x: -10, y: -10 }
        ],
        position: {
            x: 0,
            y: 0,
            z: 0
        }
    }

    let remoteCamera: Camera = {
        resolutionX: width(),
        resolutionY: height(),
        position: {
            x: 0,
            y: 0,
            z: -100
        },
        rotation: {
            x: 0,
            y: 0
        },
        update: () => undefined
    }

    const remoteCameraReceiver: Receiver<Camera> = {
        id: 'remote-camera',
        onRemoteSync: camera => remoteCamera.rotation = camera.rotation
    }

    const localCamera: Camera = {
        resolutionX: width(),
        resolutionY: height(),
        position: {
            x: 0,
            y: 0,
            z: -200
        },
        rotation: {
            x: 0,
            y: 0
        },
        update: (deltaTime) => {
            const speed = 5
            let directedSpeed = 0
            if (buttonStates.get('KeyA')) directedSpeed -= speed
            if (buttonStates.get('KeyD')) directedSpeed += speed

            const mouseMoveX = axisStates.get('mouseX')
            let yRotationToAdd = directedSpeed
            if (mouseMoveX) yRotationToAdd += mouseMoveX
            localCamera.rotation.y += deg2rad(movementDistance(yRotationToAdd, deltaTime) % 360)
            
            const mouseMoveY = axisStates.get('mouseY')
            if (mouseMoveY) {
                const xRotationToAdd = mouseMoveY
                localCamera.rotation.x += deg2rad(movementDistance(xRotationToAdd, deltaTime) % 360)
            }
        }
    }

    const cameraUpdater: Updater<Camera> = {
        for: remoteCameraReceiver.id,
        syncData: () => localCamera
    }

    startRemoteSyncing('ws://localhost:3000', {
        updaters: () => [cameraUpdater],
        receivers: () => [remoteCameraReceiver],
        error: message => alert(message)
    })

    const gameScene: Scene = {
        cameras: () => {
            const localCameraDescriptor = {
                camera: localCamera,
                position: { x: 0, y: 0 }
            }
            if (!remoteCamera) return [localCameraDescriptor]

            const remoteCameraDescriptor = {
                camera: remoteCamera,
                position: { x: 0, y: 0 }
            }
            return [localCameraDescriptor, remoteCameraDescriptor]
        },
        world: () => ({
            actors: () => [localGeometry]
        })
    }

    return gameScene
}