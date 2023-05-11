import { startScene } from '../../feature/scene/scene'
import { start } from './scenes/game'


export default function startGame(context: CanvasRenderingContext2D) {
    const gameScene = start(() => context.canvas.width, () => context.canvas.height)
    startScene(context, gameScene)
}