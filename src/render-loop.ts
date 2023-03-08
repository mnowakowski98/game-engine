import Renderable from './renderable'

let requestId: number

const renderings: Renderable[] = []

export function addRendering(rendering: Renderable) {
    renderings.push(rendering)
}

export function removeRendering(rendering: Renderable) {
    renderings.splice(renderings.findIndex(_ => rendering.id === _.id), 1)
}

let _context: CanvasRenderingContext2D | null

function renderFrame() {
    if(_context == null) {
        console.error('renderFrame called while context is null')
        return
    }

    const canvasWidth = _context.canvas.width
    const canvasHeight = _context.canvas.height
    _context.clearRect(0, 0, canvasWidth, canvasHeight)

    for(const rendering of renderings) {
        _context.save()

        const didRender = rendering.render(_context)
        if (!didRender) console.warn(`Rendering ${rendering.id} failed to render`)

        _context.restore()
    }

    requestId = requestAnimationFrame(renderFrame)
}

export function startRendering(context: CanvasRenderingContext2D) {
    _context = context
    renderFrame()
}

export function stopRendering() {
    cancelAnimationFrame(requestId)
}