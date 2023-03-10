import { Position } from './positionable';

const mousePosition: Position = {
    x: 0,
    y: 0
}

export function getMousePosition(): Position {
    return mousePosition
}

let isPauseKeyPressed = false
export function pauseKeyPressed(): boolean {
    return isPauseKeyPressed
}

export function registerInputs(canvas: HTMLCanvasElement) {
    canvas.addEventListener('mousemove', event => {
        mousePosition.x = event.offsetX
        mousePosition.y = event.offsetY
    })

    addEventListener('keydown', event => {
        if (event.code == 'Space') isPauseKeyPressed = true
    })

    addEventListener('keyup', event => {
        if (event.code == 'Space') {
            isPauseKeyPressed = false
            dispatchEvent(new Event('game-pause'))
        }
    })
}