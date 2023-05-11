import { Rotatable } from '../space/rotation'
import Positionable from './positionable'
import { Context } from './canvas'

export default interface Renderable extends Positionable, Rotatable {
    zIndex: number
    render: (context: Context) => void
}