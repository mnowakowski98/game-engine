import { Canvas, Context } from './canvas'
import Scene from '../../../feature/scene/scene'
import Actor from '../scene/actor'
import glRenderingPipeline from './gl'
import { CameraMatrices, getProjectionMatrices } from '../scene/camera'
import { mat4 } from 'gl-matrix'
import Mesh, { isMesh } from './mesh'
import { isRotatable } from './rotatable'
import { isPositionable } from './positionable'

type AssetFunctions = {
    draw: (matrices: CameraMatrices) => void
    unload: () => void
}

export interface RenderPipeline {
    init: (canvas: Canvas) => {
        context: Context
        loadMesh: (mesh: Mesh) => AssetFunctions
    }
    frame: (context: Context) => {
        clear: () => void
        draw?: (matrices: CameraMatrices) => void
        end?: () => void
        transition?: () => void 
    }
    
}

export function startRenderLoop(canvas: Canvas, scene: Scene): () => void {
    // TODO: Make the pipeline injectable
    const pipelineInit = glRenderingPipeline.init(canvas)
    const context = pipelineInit.context

    // Load initial assets
    const loadedMeshes = new Map<string, AssetFunctions>()
    scene.actors.forEach(actor => {
        if (isMesh(actor)) loadedMeshes.set(actor.id, pipelineInit.loadMesh(actor))
    })
    
    // Start render loop
    let isRendering = true
    let requestId = 0

    const renderFrame = () => {
        if (!isRendering) return

        const { clear } = glRenderingPipeline.frame(context)
        clear()

        scene.cameras.forEach(camera => {
            const renderActor = (actor: Actor) => {
                const matrices = getProjectionMatrices(camera.camera)

                const { modelView } = matrices
                if (isRotatable(actor)) {
                    mat4.rotateX(modelView, modelView, actor.rotation.x)
                    mat4.rotateY(modelView, modelView, actor.rotation.y)
                    if ('z' in actor.rotation) mat4.rotateZ(modelView, modelView, actor.rotation.z)
                }
        
                if (isPositionable(actor)) {
                    const { x, y } = actor.position
                    const z = ('z' in actor.position) ? actor.position.z : 0
                    mat4.translate(modelView, modelView, [x, y, -z])
                }

                if (isMesh(actor)) {
                    let mesh = loadedMeshes.get(actor.id)
                    if (!mesh) {
                        mesh = pipelineInit.loadMesh(actor)
                        loadedMeshes.set(actor.id, mesh)
                    }
                    mesh.draw(matrices)
                }

                actor.actors?.forEach(renderActor)
            }
            scene.actors.forEach(renderActor)
        })

        requestId = requestAnimationFrame(renderFrame)
    }

    requestId = requestAnimationFrame(renderFrame)
    return () => {
        isRendering = false
        cancelAnimationFrame(requestId)
    }
}