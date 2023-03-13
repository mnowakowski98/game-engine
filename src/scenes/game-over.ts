import Text, { renderText } from '../actors/text'
import { addRendering } from '../render-loop'

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

    const reset = () => {
        removeEventListener('game-pause', reset)
        dispatchEvent(new Event('game-over-reset'))
    }

    addEventListener('game-pause', reset)
}