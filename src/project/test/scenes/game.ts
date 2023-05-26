import Scene from '../../../feature/scene/scene'
import { deg2rad } from '../../../foundation/engine/space/rotation'

export function start(width: () => number, height: () => number): Scene {
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
                x: deg2rad(10),
                y: deg2rad(0),
                z: deg2rad(0)
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