import Positionable from '../engine/scene/positionable';
import Updatable from '../engine/scene/updatable'

export default interface Camera extends Updatable, Positionable {
    fov: number
}