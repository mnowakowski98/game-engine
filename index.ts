import { startGame } from './src/scenes/game'
import { registerInputs } from './src/inputs'
import { showGameOver } from './src/scenes/game-over'
import Scene, { startScene } from './src/engine/scene/scene'

addEventListener('load', () => {
    const canvas = document.createElement('canvas')
    const canvasPadding = 100
    canvas.width = innerWidth - canvasPadding
    canvas.height = innerHeight - canvasPadding
    canvas.style.margin = `${canvasPadding / 2}px`
    canvas.style.border = '1px solid black'

    document.body.style.margin = '0'
    document.body.style.backgroundColor = '#a3a3a3'
    document.body.appendChild(canvas)
    
    const context = canvas.getContext('2d')
    if(context == null) {
        console.error('Context was null')
        return
    }

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
})