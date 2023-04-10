import Unique from './unique'
import Positionable from './positionable'

export default interface Renderable extends Positionable, Unique {
    zIndex?: number
    render: (context: CanvasRenderingContext2D) => void
}