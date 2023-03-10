import { Position } from './positionable';

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
}