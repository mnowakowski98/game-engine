import Scene from '../../foundation/engine/rendering/scene'

export function startGame(sceneWidth: number, sceneHeight: number): Scene {
    const gameScene: Scene = {
        cameras: () => ([{
            resolutionX: sceneWidth,
            resolutionY: sceneHeight,
            position: {
                x: 0,
                y: 0
            }
        }]),
        world: () => ({
            width: 100,
            height: 100,
            actors: () => []
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