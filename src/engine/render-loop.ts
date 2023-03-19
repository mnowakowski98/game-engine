import Renderable from './scene/renderable'

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

export function getContextDataString(context: CanvasRenderingContext2D): string {
    return `- transform: ${context.getTransform()}`
}

export function startRenderLoop(context: CanvasRenderingContext2D): () => void {
    let isRendering = true

    console.log(`Starting render loop ${getContextDataString(context)}`)

    let requestId = 0
    const renderFrame = () => {
        if(!isRendering) return

        console.log(`Starting frame for request id ${requestId} ${getContextDataString(context)}`)

        const canvasWidth = context.canvas.width
        const canvasHeight = context.canvas.height
        context.clearRect(0, 0, canvasWidth, canvasHeight)

        renderings.sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))

        for (const rendering of renderings) {
            console.log(`Starting render for ${rendering.id} ${getContextDataString(context)}`)

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