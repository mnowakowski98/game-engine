import Scene, { startScene } from './src/feature/scene/scene'
import { Receiver, Updater, startRemoteSyncing } from './src/feature/sync/sync'

interface CanvasSettings {
    autosize?: boolean;
    backgroundColor?: string;
    cursorStyle?: string;
}

interface NetworkSettings {
    remoteUrl: string;
    receivers: () => Receiver<any>[]
    updaters: () => Updater<any>[]
}

export interface StartupSettings {
    initialSceneId: string
    scenes: Scene[]
    network?: NetworkSettings,
    canvas?: CanvasSettings
}

function setupCanvas(canvas: HTMLCanvasElement, settings?: CanvasSettings) {
    const autosize = settings?.autosize ?? false;
    const backgroundColor = settings?.backgroundColor ?? '#00000000'
    const cursorStyle = settings?.cursorStyle ?? 'pointer'

    canvas.style.backgroundColor = backgroundColor
    canvas.style.cursor = cursorStyle

    if (autosize) {
        const setCanvasSize = () => {
            canvas.width = innerWidth
            canvas.height = innerHeight - 6
        }
        addEventListener('resize', setCanvasSize)
    }
}

export function startClient(settings: StartupSettings, canvas?: HTMLCanvasElement) {
    canvas = canvas ?? document.createElement('canvas')
    setupCanvas(canvas, settings.canvas)

    const initialScene = settings.scenes.find(scene => scene.id === settings.initialSceneId)
    if (!initialScene) throw `Can't find scene: ${settings.initialSceneId}`
    startScene(canvas, initialScene)

    if (settings.network) {
        const networkSettings = settings.network
        startRemoteSyncing(networkSettings.remoteUrl, {
            updaters: networkSettings.updaters,
            receivers: networkSettings.receivers
        })
    }

    return;
}