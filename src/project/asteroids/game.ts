import Scene from '../../foundation/engine/rendering/scene'

export function startGame(sceneWidth: number, sceneHeight: number): Scene {
    const testGeometry = new Path2D()
    testGeometry.rect(-10, -10, 20, 20)

    const gameScene: Scene = {
        cameras: () => ([{
            resolutionX: sceneWidth,
            resolutionY: sceneHeight,
            position: {
                x: -50,
                y: 50
            },
            x: 0,
            y: 0
        }]),
        world: () => ({
            actors: () => [{
                id: 'test-geometry',
                geometry: testGeometry,
                position: {
                    x: 50,
                    y: 50
                },
                rotation: 0,
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
                    rotation: 0,
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