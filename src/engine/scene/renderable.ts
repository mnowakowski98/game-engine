import Positionable from './positionable'

export default interface Renderable extends Positionable {
    id: string
    render: (context: CanvasRenderingContext2D) => void
}