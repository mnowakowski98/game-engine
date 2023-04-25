import Renderable from '../engine/scene/renderable'
import { deg2rad, rad2deg } from '../math-utils'

export function drawRotationData(rendering: Renderable, context: CanvasRenderingContext2D) {
    context.save()

    // Draw rotation text
    const textX = -(rendering.position.x + 50)
    const textY = -(rendering.position.y + 50)

    context.fillStyle = 'rgb(0, 0, 0, .75'
    context.fillRect(textX - 3, textY - 10, 35, 13)

    context.fillStyle = '#00ff04'
    context.strokeStyle = '#00ff04'
    context.beginPath()
    context.fillText(`${rad2deg(rendering.rotation).toFixed(2)}`, textX, textY)

    // Draw rotation arc
    context.rotate(deg2rad(-90))
    context.beginPath()
    context.moveTo(0, 0)
    context.arc(0, 0, 25, 0, rendering.rotation, rendering.rotation < 0)
    context.closePath()
    context.stroke()

    context.restore()
}