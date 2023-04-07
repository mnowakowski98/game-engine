export function defaultCursorRenderer(context: CanvasRenderingContext2D) {
    context.beginPath()

    context.moveTo(-5, 0)
    context.lineTo(5, 0)

    context.moveTo(0, -5)
    context.lineTo(0, 5)

    context.stroke()
}