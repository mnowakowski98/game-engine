import Control from '../engine/scene/control'
import Renderable from '../engine/scene/renderable'

export default interface DebugMenu extends Renderable {
    id: string
    width: number
    height: number
    controls: Control[]
    onShouldDrawCameraRangeChange: (callback: (shouldDraw: boolean) => void) => void
}