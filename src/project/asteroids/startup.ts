import { Context } from '../../foundation/engine/rendering/canvas'
import { startRenderLoop } from '../../foundation/engine/rendering/render-loop'
import { startGame as start } from './game'


export default function startGame(context: Context) {
    const { width, height } = context.canvas
    const gameScene = start(width, height)
    startRenderLoop(context, gameScene)
}