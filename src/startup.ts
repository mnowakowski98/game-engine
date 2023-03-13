import { startGame } from './scenes/game'
import { registerInputs } from './inputs'
import { showGameOver } from './scenes/game-over'
import Scene, { startScene } from './engine/scene/scene'

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

    startScene(game, context)
}