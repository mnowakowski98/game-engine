import Positionable, { Position } from './positionable';

export default interface Collidable extends Positionable {
    isCollidingWith: (position: Position) => boolean
}