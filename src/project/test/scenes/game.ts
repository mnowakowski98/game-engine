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
                geometry: Buffer.from('-50->100,-50->100'),
                position: {
                    x: 50,
                    y: 50
                },
                actors: () => [{
                    id: 'test-sub-geometry',
                    geometry: Buffer.from('-25->50,-25->50'),
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