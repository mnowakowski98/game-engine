import { pi2 } from '../../misc/math-utils'

export interface Coordinate {
    x: number
    y: number
}

export function renderCoordinate(coord: Coordinate, context: CanvasRenderingContext2D) {
    context.save()

    context.arc(coord.x, coord.y, 5, 0, pi2)
    context.fillStyle = 'rgb(199, 93, 36, .5)'
    context.fill()
    
    context.restore()
}