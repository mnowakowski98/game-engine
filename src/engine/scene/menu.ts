import Text, { renderText } from '../../actors/text';
import { registerCommand } from '../command';
import { addRendering } from '../render-loop';
import { Position } from './positionable';

export function showMenu(center: Position) {
    const text: Text = {
        id: 'menu-text',
        text: 'Super fun asteroids game',
        size: 24,
        render: context => renderText(text, context),
        color: 'black',
        position: center
    }

    addRendering(text)

    registerCommand({
        id: 'game-pause',
        execute: () => {
            dispatchEvent(new Event('menu-end'))
        }
    })
}