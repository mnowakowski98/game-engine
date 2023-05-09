import Scene from './scene'

export function startRenderLoop(context: CanvasRenderingContext2D, scene: Scene): () => void {
    let isRendering = true

    // console.log(`Starting render loop ${getContextDataString(context)}`)

    let requestId = 0
    const renderFrame = () => {
        if (!isRendering) return

        const canvasWidth = context.canvas.width
        const canvasHeight = context.canvas.height
        context.clearRect(0, 0, canvasWidth, canvasHeight)

        if (scene.cameras && scene.world) {
            scene.cameras().forEach(camera => {
                context.save()
                context.restore()
            })
        }

        if (scene.renderings) {
            const renderings = scene.renderings().sort((a, b) => a.zIndex - b.zIndex)
            renderings.forEach(rendering => {
                context.save()
                context.translate(rendering.position.x, rendering.position.y)
                rendering.render(context)
                context.restore()
            })
        }

        requestId = requestAnimationFrame(renderFrame)
    }

    renderFrame()
    return () => {
        isRendering = false
        cancelAnimationFrame(requestId)
    }
}