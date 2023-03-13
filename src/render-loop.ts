import Renderable from './renderable'

const renderings: Renderable[] = []

export function addRendering(rendering: Renderable) {
    renderings.push(rendering)
}

export function removeRendering(rendering: Renderable) {
    renderings.splice(renderings.findIndex(_ => rendering.id === _.id), 1)
}

export function removeAllRenderings() {
    while (renderings.length > 0) renderings.pop()
}

export function startRenderLoop(context: CanvasRenderingContext2D): () => void {
    let isRendering = true

    let requestId = 0
    const renderFrame = () => {
        if(!isRendering) return

        const canvasWidth = context.canvas.width
        const canvasHeight = context.canvas.height
        context.clearRect(0, 0, canvasWidth, canvasHeight)

        for (const rendering of renderings) {
            context.save()
            context.translate(rendering.position.x, rendering.position.y)
            rendering.render(context)
            context.restore()
        }

        requestId = requestAnimationFrame(renderFrame)
    }

    renderFrame()
    return () => {
        isRendering = false
        cancelAnimationFrame(requestId)
    }
}