import { startGame } from './scenes/game'
import { registerInputs } from './engine/inputs'
import { showGameOver } from './scenes/game-over'
import Scene, { startScene } from './engine/scene/scene'
import { showMenu } from './scenes/menu'
import { addGlobalCommand } from './engine/command'
import { connectDevice, sendLedCommand } from './engine/peripheral'

export function start(context: CanvasRenderingContext2D) {
    const canvas = context.canvas
    registerInputs(canvas)

    connectDevice('ws://raspberrypi:8080')

    addGlobalCommand({
        id: 'global-activate-shield-leds',
        actions: [() => sendLedCommand({
            leds: 'shield',
            status: 'active'
        })]
    })

    addGlobalCommand({
        id: 'global-activate-health-leds',
        actions: [() => sendLedCommand({
            leds: 'health',
            status: 'active'
        })]
    })

    addGlobalCommand({
        id: 'global-deactivate-shield-leds',
        actions: [() => sendLedCommand({
            leds: 'shield',
            status: 'inactive'
        })]
    })

    addGlobalCommand({
        id: 'global-deactivate-health-leds',
        actions: [() => sendLedCommand({
            leds: 'health',
            status: 'inactive'
        })]
    })

    addGlobalCommand({
        id: 'global-set-shield-leds-full',
        actions: [() => sendLedCommand({
            leds: 'shield',
            numActive: 4
        })]
    })

    addGlobalCommand({
        id: 'global-set-health-leds-full',
        actions: [() => sendLedCommand({
            leds: 'health',
            numActive: 4
        })]
    })

    const game: Scene = {
        endSceneEventType: 'game-end',
        init: () => startGame(canvas.width, canvas.height),
        onSceneEnd: () => startScene(gameOver, context)
    }

    const gameOver: Scene = {
        endSceneEventType: 'game-over-reset',
        init: () => showGameOver(canvas.width, canvas.height),
        onSceneEnd: () => startScene(game, context)
    }

    const menu: Scene = {
        endSceneEventType: 'menu-end',
        init: () => showMenu({ x: canvas.width / 2, y: canvas.height / 2 }),
        onSceneEnd: () => startScene(game, context)
    }

    addGlobalCommand({
        id: 'global-show-menu-scene',
        actions: [() => { startScene(menu, context) }]
    })

    startScene(menu, context)
    // startScene(game, context)
}