import Scene, { startScene } from '../../feature/scene/scene'
import { Receiver, Updater, startRemoteSyncing } from '../../feature/sync/sync'

export { Scene, Receiver, Updater }
export { Camera, World, Actor, Coordinate, Unique } from '../../feature/scene/scene'

export interface StartupSetttings {
    initialSceneId: string
    scenes: Scene[]
    network?: {
        remoteUrl: string
        receivers: () => Receiver<any>[]
        updaters: () => Updater<any>[]
    }    
}

export function start(settings: StartupSetttings) {
    addEventListener('load', () => {
        document.body.style.margin = '0'
        document.body.style.backgroundColor = 'black'
    
        const canvas = document.createElement('canvas')
        canvas.style.backgroundColor = '#a3a3a3'
        canvas.style.cursor = 'none'
    
        const setCanvasSize = () => {
            canvas.width = innerWidth
            canvas.height = innerHeight - 6
        }
    
        addEventListener('resize', setCanvasSize)
        setCanvasSize()
    
        document.body.appendChild(canvas)

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
    })
}