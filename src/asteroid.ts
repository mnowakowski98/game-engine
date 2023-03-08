import Position from './position'
import Renderable from './renderable'

export default class Asteroid implements Renderable {

    public readonly id: number

    private position: Position = {
        x: 250,
        y: 250
    }

    public constructor(id: number) {
        this.id = id
    }

    public render(context: CanvasRenderingContext2D): boolean {
        context.beginPath()
        context.arc(this.position.x, this.position.y, 50, 0, Math.PI * 2)
        context.closePath()

        context.fillStyle = "#c2a07c"
        context.fill()
        context.stroke()
        return true
    }
}