import Asteroid from './src/asteroid'
import Collidable from './src/collidable'
import { addRendering, removeRendering, startRendering } from './src/render-loop'
import Ship from './src/ship'
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
        update: () => true,
        render: () => true,
        position: {
            x: 50,
            y: canvas.height / 2
        }
    }

    canvas.addEventListener('mousemove', event => {
        ship.position.x = event.offsetX
        ship.position.y =event.offsetY
    })

    addRendering(ship)
    addUpdatable(ship)

    const asteroid: Asteroid = {
        id: 1,
        boundingRadius: 25,
        update: () => true,
        render: () => true,
        isCollidingWith: position => {
            const differenceX = position.x - asteroid.position.x
            const differenceY = position.y - asteroid.position.y
            const distance = (differenceX * differenceX + differenceY * differenceY)
            return distance <= asteroid.boundingRadius
        },
        position: {
            x: 250,
            y: 250
        }
    }

    addRendering(asteroid)
    addUpdatable(asteroid)

    startUpdating()
    startRendering(context)
})