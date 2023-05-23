import Scene from '../../../feature/scene/scene'

export function start(width: () => number, height: () => number): Scene {
    const gameScene: Scene = {
        cameras: () => ([{
            resolutionX: width(),
            resolutionY: height(),
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
                    { x: -10, y: -10 },
                    { x: 10, y: -10 },
                    { x: 10, y: 10 },
                    { x: -10, y: 10 }
                ],
                position: {
                    x: 50,
                    y: 50
                },
                actors: () => [{
                    id: 'test-sub-geometry',
                    geometry: [
                        { x: -5, y: -5 },
                        { x: 5, y: -5 },
                        { x: 5, y: 5 },
                        { x: -5, y: 5 }
                    ],
                    position: {
                        x: 50,
                        y: 50
                    }
                }]
            }]
        })
    }

    return gameScene
}