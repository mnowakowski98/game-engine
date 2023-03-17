import Text, { renderText } from '../actors/text';
import { addRendering } from '../engine/render-loop';

export function startMenu(canvasWidth: number, canvasHeight: number) {
    const testText: Text = {
        id: 'test-text',
        text: 'Test',
        size: 12,
        color: 'red',
        position: {
            x: canvasWidth / 2,
            y: canvasHeight / 2
        },
        render: context => renderText(testText, context)
    }

    const startListener = () => {
        removeEventListener('game-pause', startListener)
        dispatchEvent(new Event('menu-newgame'))
    }

    addEventListener('game-pause', startListener)

    addRendering(testText)
}