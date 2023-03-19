import Positionable from './positionable'

export default interface Renderable extends Positionable {
    id: string
    zIndex?: number
    render: (context: CanvasRenderingContext2D) => void
}