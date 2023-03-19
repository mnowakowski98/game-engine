import Control from '../engine/scene/control'
import { Position } from '../engine/scene/positionable'

export default interface Checkbox extends Control {
    text: string
    onUpdate: () => void
}

export function renderCheckBox(checkbox: Checkbox, isChecked: boolean, context: CanvasRenderingContext2D) {
    context.strokeRect(0, 0, checkbox.width, checkbox.height)
    if (isChecked) context.fillRect(0, 0, checkbox.width, checkbox.height)
    context.fillText(checkbox.text, checkbox.width + 5, checkbox.height * .8)
}

export function isPointInCheckBox(checkbox: Checkbox, position: Position) {
    const {x, y} = checkbox.position
    const { width, height } = checkbox

    const isInXRange = position.x >= x && position.x <= x + width
    const isInYRange = position.y >= y && position.y <= y + height

    return (isInXRange && isInYRange)
}