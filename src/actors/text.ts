import Renderable from '../renderable'

export default interface Text extends Renderable {
    text: string
    size: number
    color: string
}

export function renderText(text: Text, context: CanvasRenderingContext2D) {
    context.fillText(text.text, context.canvas.width / 2, context.canvas.height / 2)
}