import { start } from './index'
import Scene from '../../feature/scene/scene'

const scene: Scene = {
    id: 'blank'
}

start({
    initialSceneId: 'blank',
    scenes: [scene]
})