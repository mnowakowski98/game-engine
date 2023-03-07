let requestId: number

function renderFrame(context: CanvasRenderingContext2D) {
    const canvasWidth = context.canvas.width
    const canvasHeight = context.canvas.height

    context.clearRect(0, 0, canvasWidth, canvasHeight)

    context.lineWidth = 10;
    context.strokeRect(0, 0, canvasWidth, canvasHeight)

    requestId = requestAnimationFrame(() => renderFrame(context))
}

export function startRendering(context: CanvasRenderingContext2D) {
    renderFrame(context)
}

export function stopRendering() {
    cancelAnimationFrame(requestId)
}