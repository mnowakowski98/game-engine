import { startScene } from '../../feature/scene/scene'
import { start } from './scenes/game'


export default function startGame(context: CanvasRenderingContext2D) {
    const { width, height } = context.canvas
    const gameScene = start(width, height)
    startScene(context, gameScene)
}