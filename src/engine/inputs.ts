import Command, { executeCommand, registerCommand } from './command';
import { Position } from './scene/positionable';

const mousePosition: Position = {
    x: 0,
    y: 0
}

export function getMousePosition(): Position {
    return mousePosition
}

export const mouseClickCommand: Command = {
    id: 'input-mouse-click',
    actions: []
}

export function registerInputs(canvas: HTMLCanvasElement) {
    canvas.addEventListener('mousemove', event => {
        mousePosition.x = event.offsetX
        mousePosition.y = event.offsetY
    })

    addEventListener('keyup', event => {
        let matched = true

        switch (event.code) {
            case 'Space':
                executeCommand('game-pause')
                executeCommand('game-over-reset')
                break

            case 'Escape':
                executeCommand('global-show-menu-scene')
                break

            case 'Backquote':
                executeCommand('game-show-debug-menu')
                break

            default:
                matched = false
                break 
        }

        if (matched) event.preventDefault()
    })

    registerCommand(mouseClickCommand)

    canvas.addEventListener('click', () => {
        executeCommand(mouseClickCommand.id)
    })
}