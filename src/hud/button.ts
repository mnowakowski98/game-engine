import Control from '../foundation/engine/scene/control'
import { Position } from '../foundation/engine/scene/positionable'

export default interface Button extends Control {
    text: string
    onActivate: () => void
}

export function renderButton(button: Button, context: CanvasRenderingContext2D) {
    const halfWidth = button.width / 2
    const halfHeight = button.height / 2

    context.fillStyle = '#1f6487'
    context.fillRect(-halfWidth, -halfHeight, button.width, button.height)

    context.fillStyle = '#bfced6'
    context.fillText(button.text, -halfWidth + 23, -halfHeight + 15)
}

export function isPointInButton(button: Button, position: Position): boolean {
    const {x, y} = button.position
    const halfWidth = button.width / 2
    const halfHeight = button.height / 2

    const isInXRange = position.x <= x + halfWidth && position.x >= x - halfWidth
    const isInYRange = position.y <= y + halfHeight && position.y >= y - halfHeight

    return (isInXRange && isInYRange)
}