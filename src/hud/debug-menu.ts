import Control from '../foundation/engine/scene/control'
import Renderable from '../foundation/engine/scene/renderable'

export default interface DebugMenu extends Renderable {
    id: string
    width: number
    height: number
    controls: Control[]
}