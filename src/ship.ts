import Updateable from './updatable'
import Renderable from './renderable'

export default class Ship implements Updateable, Renderable {
    public readonly id: number

    public positionX = 50
    public positionY = 50

    public constructor(id: number) {
        this.id = id
    }

    public update(): boolean {
        this.positionX += 1
        this.positionY += 1
        return true
    }

    public render(context: CanvasRenderingContext2D): boolean {
        context.beginPath()
        context.arc(this.positionX, this.positionY, 20, 0, 2*Math.PI)
        context.closePath()

        context.strokeStyle = "red"
        context.lineWidth = 2
        context.stroke()
        return true
    }
}