import { startGame } from './src/scenes/game'
import { startRenderLoop } from './src/render-loop'
import { startUpdateLoop } from './src/update-loop'
import { registerInputs } from './src/inputs'
import { showGameOver } from './src/scenes/game-over'

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

    startUpdateLoop()
    startRenderLoop(context)
    registerInputs(canvas)
    startGame(canvas.width, canvas.height)
    addEventListener('game-end', () => {
        showGameOver(canvas.width, canvas.height)
        const restartGame = () => {
            removeEventListener('game-over-reset', restartGame)
            startGame(canvas.width, canvas.height)
        }
        addEventListener('game-over-reset', restartGame)
    })
})