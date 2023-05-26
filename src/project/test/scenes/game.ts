import Scene from '../../../feature/scene/scene'
import { deg2rad } from '../../../foundation/engine/space/rotation'

export function start(width: () => number, height: () => number): Scene {
    const gameScene: Scene = {
        cameras: () => ([{
            resolutionX: width() / 2,
            resolutionY: height() / 2,
            position: {
                x: -50,
                y: 50
            },
            x: 0,
            y: 0,
            update: () => undefined
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
                    x: -50,
                    y: -50
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
                        x: 150,
                        y: 50
                    },
                    rotation: {
                        x: 0,
                        y: deg2rad(90),
                        z: deg2rad(45)
                    }
                }]
            }]
        })
    }

    return gameScene
}