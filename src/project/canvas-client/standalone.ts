import { startClient } from './client'
import Scene from '../../feature/scene/scene'

const scene: Scene = {
    id: 'blank'
}

startClient({
    initialSceneId: 'blank',
    scenes: [scene]
})