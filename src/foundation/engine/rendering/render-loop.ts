import Scene from './scene'

export function startRenderLoop(context: CanvasRenderingContext2D, scene: Scene): () => void {
    let isRendering = true

    let requestId = 0
    const renderFrame = () => {
        if (!isRendering) return

        const canvasWidth = context.canvas.width
        const canvasHeight = context.canvas.height
        context.clearRect(0, 0, canvasWidth, canvasHeight)

        if (scene.cameras && scene.world) {
            const world = scene.world()
            if(!world.actors) return

            const actors = world.actors()
            scene.cameras().forEach(camera => {
                context.save()

                const halfRes = [camera.resolutionX / 2, camera.resolutionY / 2]
                context.translate(camera.x + halfRes[0], camera.y + halfRes[1])

                context.beginPath()
                context.rect(-halfRes[0], -halfRes[1], camera.resolutionX, camera.resolutionY)
                context.clip()
                context.stroke()

                actors.forEach(actor => {
                    context.translate(-camera.position.x + actor.position.x, -camera.position.y + actor.position.y)

                    if ('geometry' in actor) {
                        context.fill(actor.geometry)
                        context.stroke(actor.geometry)
                    }
                    
                    if ('render' in actor) {
                        context.save()
                        actor.render(context)
                        context.restore()
                    }
                })

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