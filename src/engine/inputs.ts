import { executeCommand } from './command';
import { Position } from './scene/positionable';

const mousePosition: Position = {
    x: 0,
    y: 0
}

export function getMousePosition(): Position {
    return mousePosition
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

            default:
                matched = false
                break 
        }

        if (matched) event.preventDefault()
    })

    canvas.addEventListener('click', event => {
        executeCommand('input-mouse-click')
    })
}