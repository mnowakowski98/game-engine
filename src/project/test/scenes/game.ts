import { Command, InputContext, startInputContext } from '../../../feature/input/input'
import Scene from '../../../feature/scene/scene'
import { movementDistance } from '../../../foundation/engine/space/distance'
import { deg2rad } from '../../../foundation/engine/space/rotation'



export function start(width: () => number, height: () => number): Scene {
    let cameraRotationY = 0
    let shouldMoveLeft = false
    let shouldMoveRight = false

    const spaceCommand: Command = {
        code: 'Space',
        type: 'press',
        action: () => alert('derp')
    }

    const moveLeft: Command = {
        code: 'KeyA',
        type: 'hold',
        action: () => shouldMoveLeft = !shouldMoveLeft
    }

    const moveRight: Command = {
        code: 'KeyD',
        type: 'hold',
        action: () => shouldMoveRight = !shouldMoveRight
    }

    const inputContext: InputContext = {
        id: 'game-input-context',
        commands: [spaceCommand, moveLeft, moveRight]
    }

    startInputContext(inputContext)

    const gameScene: Scene = {
        cameras: () => ([{
            resolutionX: width(),
            resolutionY: height(),
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
                const speed = 5 / 10
                let directedSpeed = 0
                if (shouldMoveLeft) directedSpeed -= speed
                if (shouldMoveRight) directedSpeed += speed
                const newRotation = deg2rad(movementDistance(directedSpeed, deltaTime))
                cameraRotationY += newRotation < 180 ? newRotation : newRotation % -180
            }
        }, {
            resolutionX: width(),
            resolutionY: height(),
            position: {
                x: 25,
                y: -50,
                z: -500
            },
            rotation: {
                x: deg2rad(15),
                y: deg2rad(45)
            },
            update: () => undefined,
            x: 0,
            y: 0
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
            },
            {
                id: 'test-floor',
                geometry: [
                    { x: 100, y: 100 },
                    { x: -100, y: 100 },
                    { x: 100, y: -100 },
                    { x: -100, y: -100 }
                ],
                position: {
                    x: 0,
                    y: 0,
                    z: -25
                },
                rotation: {
                    x: deg2rad(90),
                    y: 0,
                    z: 0
                }
            }]
        })
    }

    return gameScene
}