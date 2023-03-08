import { Asteroid, renderAsteroid, checkCollision } from './src/asteroid'
import { addRendering, startRendering } from './src/render-loop'
import { renderShip, Ship } from './src/ship'
import { addUpdatable, startUpdating } from './src/update-loop'

addEventListener('load', () => {
    const canvas = document.createElement('canvas')
    const canvasPadding = 100
    canvas.width = innerWidth - canvasPadding
    canvas.height = innerHeight - canvasPadding
    canvas.style.margin = `${canvasPadding / 2}px`
    canvas.style.border = '1px solid black'

    document.body.style.margin = '0'
    document.body.style.backgroundColor = '#a3a3a3'
    document.body.appendChild(canvas)
    
    const context = canvas.getContext('2d')
    if(context == null) {
        console.error('Context was null')
        return
    }

    const ship: Ship = {
        id: 0,
        colliding: false,
        position: {
            x: 50,
            y: canvas.height / 2
        },
        rotation: 90,
        width: 25,
        length: 50,
        render: context => renderShip(ship, context),
        update: () => true
    }

    canvas.addEventListener('mousemove', event => {
        ship.position.x = event.offsetX
        ship.position.y = event.offsetY
    })

    addRendering(ship)
    addUpdatable(ship)

    const asteroid: Asteroid = {
        id: 1,
        boundingRadius: 25,
        update: (deltaTime: number) => {
            if(asteroid.isCollidingWith(ship.position)) ship.colliding = true
            else ship.colliding = false
            return true
        },
        render: context => renderAsteroid(asteroid, context),
        isCollidingWith: position => checkCollision(asteroid, position),
        position: {
            x: canvas.width / 2,
            y: canvas.height / 2
        }
    }

    addRendering(asteroid)
    addUpdatable(asteroid)

    startUpdating()
    startRendering(context)
})