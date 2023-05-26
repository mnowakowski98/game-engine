import Scene from '../../../feature/scene/scene'
import Camera from '../../../foundation/engine/rendering/camera'
import { movementDistance } from '../../../foundation/engine/space/distance'
import { deg2rad } from '../../../foundation/engine/space/rotation'

export function start(width: () => number, height: () => number): Scene {
    let cameraRotationY = 0

    const gameScene: Scene = {
        cameras: () => ([{
            resolutionX: width() / 2,
            resolutionY: height() / 2,
            position: {
                x: 0,
                y: 0,
                z: -500
            },
            rotation: {
                x: 0,
                y: cameraRotationY
            },
            x: 0,
            y: 0,
            update: (deltaTime) => {
                const newRotation = deg2rad(movementDistance(5 / 50, deltaTime))
                cameraRotationY += newRotation < 180 ? newRotation : newRotation % -180
            }
        }]),
        world: () => ({
            actors: () => [{
                id: 'test-geometry',
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
                },
                actors: () => [{
                    id: 'test-sub-geometry',
                    geometry: [
                        { x: 20, y: 20 },
                        { x: -20, y: 20 },
                        { x: 20, y: -20 },
                        { x: -20, y: -20 }
                    ],
                    position: {
                        x: 0,
                        y: 0,
                        z: -250
                    }
                }]
            }]
        })
    }

    return gameScene
}