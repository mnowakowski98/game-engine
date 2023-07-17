import { Canvas } from '../../foundation/engine/rendering/canvas'
import { startRenderLoop } from '../../foundation/engine/rendering/render-loop'
import { startUpdateLoop } from '../../foundation/engine/update/update-loop'
import Scene from '../../foundation/engine/scene/scene'
import Actor from '../../foundation/engine/scene/actor'
import Camera from '../../foundation/engine/scene/camera'
import { Coordinate2d } from '../../foundation/engine/space/coordinates'

export default Scene

export function startScene(canvas: Canvas, scene: Scene): () => void {
    const stopRenderLoop = startRenderLoop(canvas, scene)
    const stopUpdateLoop = startUpdateLoop(scene)

    return () => {
        stopRenderLoop()
        stopUpdateLoop()
    }
}

export function addCamera(scene: Scene, camera: Camera, position: Coordinate2d) {
    if (scene.cameras.has(camera.id)) throw 'Camera is already in scene'

    const cameras = new Map(scene.cameras)
    cameras.set(camera.id, { camera: camera, screenPosition: position })
    scene.cameras = cameras
}

export function removeCamera(scene: Scene, camera: Camera) {
    if (!scene.cameras.has(camera.id)) throw 'Camera is already not in scene'

    const cameras = new Map(scene.cameras)
    cameras.delete(camera.id)
    scene.cameras = cameras
}

export function addActor(scene: Scene, actor: Actor) {
    if (scene.actors.has(actor.id)) throw 'Actor is already in scene'

    const actors = new Map(scene.actors)
    actors.set(actor.id, actor)
    scene.actors = actors
}

export function removeActor(scene: Scene, actor: Actor) {
    if (!scene.actors.has(actor.id)) throw 'Actor is already not in scene'

    const actors = new Map(scene.actors)
    actors.delete(actor.id)
    scene.actors = actors
}