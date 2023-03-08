import Updateable from './updatable'
import Renderable from './renderable'
import Positionable from './positionable'

export default interface Ship extends Updateable, Renderable, Positionable {
}

// export default class Ship extends RadialPositionDistanceCollidable implements Updateable, Renderable, Collidable {
    

//     public readonly id: number

//     public constructor(id: number) {
//         super()
//         this.id = id
//     }

//     private length = 50
//     private width = 25

//     protected boundingRadius = 35

//     protected position: Positionable = {
//         x: 50,
//         y: 50
//     }

//     public setPosition(x: number, y: number) {
//         this.position.x = x
//         this.position.y = y
//     }

//     private rotation = 90

//     public update(deltaTime: number): boolean {
//         return true
//     }

//     public colliding = false

//     private path = new Path2D()

//     public render(context: CanvasRenderingContext2D): boolean {
//         this.path = new Path2D()

//         context.translate(this.position.x, this.position.y)
//         context.rotate((this.rotation * Math.PI) / 180)
//         context.translate(-this.position.x, -this.position.y)

//         this.path.moveTo(this.position.x - this.width / 2, this.position.y + this.length / 2)
//         this.path.lineTo(this.position.x + this.width / 2, this.position.y + this.length / 2)
//         this.path.lineTo(this.position.x, this.position.y - this.length / 2)

//         this.path.closePath()

//         context.lineWidth = 2
//         if (this.colliding) context.fillStyle = "red"
//         else context.fillStyle = "green"
//         context.fill(this.path)
//         context.stroke(this.path)
//         return true
//     }
// }