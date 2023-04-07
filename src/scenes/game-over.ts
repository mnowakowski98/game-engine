import Text, { renderText } from '../hud/text'
import Command, { executeCommand, registerCommand } from '../engine/command'
import { addRendering } from '../engine/render-loop'

export function showGameOver(canvasWidth: number, canvasHeight: number) {
    const text: Text = {
        id: 'game-over-text',
        text: 'You deadeded',
        color: 'white',
        size: 14,
        position: {
            x: canvasWidth / 2,
            y: canvasHeight / 2
        },
        render: context => renderText(text, context)
    }
    addRendering(text)

    const reset: Command = {
        id: 'game-over-reset',
        actions: [() => dispatchEvent(new Event('game-over-reset'))]
    }

    registerCommand(reset)

    executeCommand('global-deactivate-green-led')
    executeCommand('global-activate-red-led')
}