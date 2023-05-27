import { startInputContext } from '../../feature/input/input-context'
import { startScene } from '../../feature/scene/scene'
import { start } from './scenes/game'


export default function startGame(canvas: HTMLCanvasElement) {
    const [gameScene, inputContext] = start(() => canvas.width, () => canvas.height)
    startScene(canvas, gameScene)
    const stopInputContext = startInputContext(inputContext)
    setTimeout(stopInputContext, 10000)
}