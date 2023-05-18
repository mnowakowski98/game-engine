import Scene from '../../../feature/scene/scene'

export function start(width: () => number, height: () => number): Scene {
    const testGeometry = new Path2D()
    testGeometry.rect(-10, -10, 20, 20)

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
                geometry: testGeometry,
                position: {
                    x: 50,
                    y: 50
                },
                material: {
                    diffuse: new Path2D()
                },
                actors: () => [{
                    id: 'test-sub-geometry',
                    geometry: testGeometry,
                    position: {
                        x: 50,
                        y: 50
                    },
                    material: {
                        diffuse: new Path2D()
                    }
                }]
            }]
        }),
        renderings: () => ([{
            position: {
                x: 10,
                y: 10
            },
            rotation: 0,
            zIndex: 0,
            render: context => {
                context.fillRect(0, 0, 10, 10)
            }
        }])
    }

    return gameScene
}