import { startGame } from './scenes/game'
import { registerInputs } from './engine/inputs'
import { showGameOver } from './scenes/game-over'
import Scene, { getCurrentScene, startScene } from './engine/scene/scene'
import { showMenu } from './scenes/menu'
import { addGlobalCommand } from './engine/command'

export function start(context: CanvasRenderingContext2D) {
    const canvas = context.canvas
    registerInputs(canvas)

    const game: Scene = {
        endSceneEventType: 'game-end',
        init: () => startGame(canvas.width, canvas.height),
        onSceneEnd: () => startScene(gameOver, context)
    }

    const gameOver: Scene = {
        endSceneEventType: 'game-over-reset',
        init: () => showGameOver(canvas.width, canvas.height),
        onSceneEnd: () => startScene(game, context)
    }

    const menu: Scene = {
        endSceneEventType: 'menu-end',
        init: () => showMenu({ x: canvas.width / 2, y: canvas.height / 2 }),
        onSceneEnd: () => startScene(game, context)
    }

    addGlobalCommand({
        id: 'global-show-menu-scene',
        actions: [() => {
            dispatchEvent(new Event(getCurrentScene().endSceneEventType))
            startScene(menu, context)
        }]
    })

    startScene(menu, context)
    // startScene(game, context)
}