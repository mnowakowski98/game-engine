import Button, { isPointInButton, renderButton } from '../hud/button';
import Text, { renderText } from '../hud/text';
import { addCommandAction, executeCommand } from '../foundation/engine/command';
import { getMousePosition, mouseClickCommand } from '../foundation/engine/inputs';
import { addRendering } from '../foundation/engine/render-loop';
import { Position } from '../foundation/engine/scene/positionable';
import Renderable from '../foundation/engine/scene/renderable';

export function showMenu(center: Position) {
    const background: Renderable = {
        id: 'menu-background',
        position: {
            x: 0,
            y: 0
        },
        rotation: 0,
        render: context => {
            const gradient = context.createLinearGradient(0, 0, context.canvas.width, context.canvas.height)
            gradient.addColorStop(0, '#0cc25b')
            gradient.addColorStop(1, '#25302a')
            context.fillStyle = gradient
            context.fillRect(0, 0, context.canvas.width, context.canvas.height)
        }
    }

    addRendering(background)

    const text: Text = {
        id: 'menu-text',
        text: 'Super Fun Asteroids Game',
        size: 24,
        render: context => renderText(text, context),
        color: 'black',
        position: {
            x: center.x - 60,
            y: center.y - 25
        },
        rotation: 0
    }

    addRendering(text)

    const startButton: Button = {
        id: 'menu-start-button',
        width: 100,
        height: 25,
        text: 'Start Game',
        position: center,
        rotation: 0,
        onActivate: () => dispatchEvent(new Event('menu-end')),
        render: context => renderButton(startButton, context)
    }

    addCommandAction(mouseClickCommand, () => {
        if (isPointInButton(startButton, getMousePosition()))
            startButton.onActivate()
    })

    addRendering(startButton)

    executeCommand('global-deactivate-shield-leds')
    executeCommand('global-deactivate-health-leds')
}