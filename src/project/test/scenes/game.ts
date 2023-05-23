import Scene from '../../../feature/scene/scene'

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
                    { x: 1, y: 1 },
                    { x: -1, y: 1 },
                    { x: 1, y: -1 },
                    { x: -1, y: -1 }
                ],
                position: {
                    x: -50,
                    y: -50
                },
                actors: () => [{
                    id: 'test-sub-geometry',
                    geometry: [
                        { x: 0.5, y: 0.5 },
                        { x: -0.5, y: 0.5 },
                        { x: 0.5, y: -0.5 },
                        { x: -0.5, y: -0.5 }
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