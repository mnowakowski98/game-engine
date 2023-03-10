import Text, { renderText } from '../actors/text'
import { addRendering } from '../render-loop'

export function showGameOver(canvasWidth: number, canvasHeight: number) {
    const text: Text = {
        id: 'game-over-text',
        text: 'You deadeded',
        color: 'white',
        size: 14,
        render: context => renderText(text, context)
    }
    addRendering(text)
}