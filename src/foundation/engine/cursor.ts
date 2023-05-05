export function defaultCursorRenderer(context: CanvasRenderingContext2D) {
    context.beginPath()

    context.rect(-1, -10, 2, 20)
    context.rect(-10, -1, 20, 2)

    context.strokeStyle = '#fafafa'
    context.lineWidth = 1

    context.fillStyle = 'white'
    context.fill()
    context.stroke()
}