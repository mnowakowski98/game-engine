import Pausable from '../engine/scene/pausable';
import Renderable from '../engine/scene/renderable';
import Updatable from '../engine/scene/updatable';

export default interface GameTimer extends Renderable, Updatable, Pausable {
    time: number
}

export function renderGameTimer(timer: GameTimer, context: CanvasRenderingContext2D) {
    const seconds = (timer.time / 1000)
    const secondsClamped = seconds % 60
    const secondsText = `${secondsClamped < 10 ? '0' + secondsClamped.toFixed(2) : secondsClamped.toFixed(2) }`

    const minutes = Math.floor(seconds / 60)
    const minutesClamped = minutes % 60
    const minutesText = `${minutesClamped < 10 ? '0' + minutesClamped : minutesClamped}`

    const hours = Math.floor(minutes / 60)
    const timeText = `${hours} : ${minutesText} : ${secondsText}`

    context.fillText(`${timeText}`, 0, 0)
}